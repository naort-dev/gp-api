const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
const https = require('https');
const { isWithinTokenLimit } = require('gpt-tokenizer');

const { Configuration, OpenAIApi } = require('openai');
const openAiKey = sails.config.custom.openAi || sails.config.openAi;

const AiConfiguration = new Configuration({
  apiKey: openAiKey,
});
const openai = new OpenAIApi(AiConfiguration);

const accessKeyId =
  sails.config.custom.awsAccessKeyId || sails.config.awsAccessKeyId;
const secretAccessKey =
  sails.config.custom.awsSecretAccessKey || sails.config.awsSecretAccessKey;
const queueUrl = sails.config.custom.queueUrl || sails.config.queueUrl;

let queue;
AWS.config.update({
  region: 'eu-west-2',
  accessKeyId,
  secretAccessKey,
});

module.exports = {
  inputs: {},
  exits: {
    success: {
      description: 'ok',
    },

    badRequest: {
      description: 'Error',
    },
  },
  fn: async function (inputs, exits) {
    try {
      if (!queueUrl) {
        return exits.success('not ok');
      }
      if (!queue) {
        console.log('no queue instance, creating a new one');
        queue = Consumer.create({
          queueUrl,
          handleMessage: async (message) => {
            await handleMessage(message);
          },
          sqs: new AWS.SQS({
            httpOptions: {
              agent: new https.Agent({
                keepAlive: true,
              }),
            },
          }),
        });
        queue.on('error', (err) => {
          console.error(err.message);
        });

        queue.on('processing_error', (err) => {
          console.error(err.message);
        });

        queue.start();
      }
      return exits.success('ok');
    } catch (e) {
      return exits.success('not ok');
    }
  },
};

const camelToSentence = (text) => {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

async function handleMessage(message) {
  if (!message) {
    return;
  }
  const body = message.Body;
  if (!body) {
    return;
  }
  const action = JSON.parse(body);
  const { type, data } = action;
  console.log('processing queue message type ', type);
  switch (type) {
    case 'generateCampaignPlan':
      await handleGenerateCampaignPlan(data);
      break;
  }
}

async function handleGenerateCampaignPlan(message) {
  const { prompt, slug, subSectionKey, key, existingChat } = message;
  let chat = existingChat || [];
  let messages = [{ role: 'user', content: prompt }, ...chat];
  let campaign;
  let data;
  let chatResponse;

  try {
    await sails.helpers.errorLoggerHelper(
      'handling campaign from queue',
      message,
    );

    // replace invalid characters
    for (let i = 0; i < messages.length; i++) {
      messages[i].content = messages[i].content.replace(/\–/g, '-');
      messages[i].content = messages[i].content.replace(/\`/g, "'");
    }

    let promptTokens = 0;
    for (const message of messages) {
      const tokens = isWithinTokenLimit(message.content, 13000) || 13000;
      promptTokens += tokens;
    }

    if (promptTokens >= 13000) {
      // todo: fail the request here? capture the error on the frontend?
      console.log('Error! Exceeded the token limit!');
    }

    await sails.helpers.errorLoggerHelper(
      `[ ${slug} - ${key} ] Prompt Size (Tokens):`,
      promptTokens,
    );

    campaign = await Campaign.findOne({ slug });
    data = campaign.data;

    let completion = await openai.createChatCompletion({
      model: promptTokens < 1500 ? 'gpt-3.5-turbo' : 'gpt-3.5-turbo-16k',
      max_tokens: existingChat && existingChat.length > 0 ? 2000 : 2500,
      messages: messages,
    });
    chatResponse = completion.data.choices[0].message.content.replace(
      '/n',
      '<br/><br/>',
    );
    const totalTokens = completion.data.usage.total_tokens;

    await sails.helpers.errorLoggerHelper(
      `[ ${slug} - ${key} ] Generation Complete. Model: ${model}. Tokens Used:`,
      totalTokens,
    );

    if (chatResponse && chatResponse !== '') {
      await sails.helpers.ai.saveCampaignVersion(
        data,
        subSectionKey,
        key,
        campaign.id,
      );

      if (subSectionKey === 'aiContent') {
        data[subSectionKey][key] = {
          name: camelToSentence(key),
          updatedAt: new Date().valueOf(),
          content: chatResponse,
        };
      } else {
        data[subSectionKey][key] = chatResponse;
      }
      if (
        !data.campaignPlanStatus ||
        typeof campaign.campaignPlanStatus === 'string'
      ) {
        data.campaignPlanStatus = {};
      }
      data.campaignPlanStatus[key] = 'completed';
      await Campaign.updateOne({
        slug,
      }).set({
        data,
      });
      await sails.helpers.errorLoggerHelper(
        `updated campaign with ai. chatResponse: subSectionKey: ${subSectionKey}. key: ${key}`,
        chatResponse,
      );
    }
  } catch (e) {
    console.log('error at consumer', e);
    console.log('messages', messages);

    if (e.data) {
      await sails.helpers.errorLoggerHelper(
        'error at AI queue consumer (with msg): ',
        e.data.error,
      );
      console.log('error', e.data.error);
    } else {
      await sails.helpers.errorLoggerHelper(
        'error at AI queue consumer. Queue Message: ',
        message,
      );
      await sails.helpers.errorLoggerHelper(
        'error at AI queue consumer debug: ',
        e,
      );
    }
  }

  // Failed to generate content.
  if (!chatResponse || chatResponse === '') {
    try {
      // Track our failed attempts.
      if (!data.campaignPlanAttempts) {
        data.campaignPlanAttempts = {};
      }
      data.campaignPlanAttempts[key] = data.campaignPlanAttempts[key]
        ? data.campaignPlanAttempts[key] + 1
        : 1;

      await sails.helpers.errorLoggerHelper(
        'Current Attempts:',
        data.campaignPlanAttempts[key],
      );

      // After 3 attempts, we give up.
      if (data.campaignPlanStatus[key] !== 'completed') {
        if (data.campaignPlanAttempts[key] >= 3) {
          await sails.helpers.errorLoggerHelper(
            'Deleting campaignPlanStatus for key',
            key,
          );
          delete data.campaignPlanStatus[key];
        }
      }
      await Campaign.updateOne({
        slug,
      }).set({
        data,
      });
    } catch (e) {
      console.log('error at consumer', e);
    }
    // throw an Error so that the message goes back to the queue or the DLQ.
    throw new Error('error generating ai content');
  }
}
