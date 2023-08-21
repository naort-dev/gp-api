const slugify = require('slugify');

const topIssues = {
  positions: [
    {
      createdAt: 1649095556912,
      updatedAt: 1658420397139,
      id: 13,
      name: 'Wealth Tax',
      topIssue: null,
    },
    {
      createdAt: 1649095557329,
      updatedAt: 1649095557329,
      id: 101,
      name: 'Breakup Monopolies',
      topIssue: {
        createdAt: 1649095557324,
        updatedAt: 1649095557324,
        id: 24,
        name: 'Business',
      },
    },
    {
      createdAt: 1649095557376,
      updatedAt: 1649095557376,
      id: 110,
      name: 'Congressional Stock Ban',
      topIssue: {
        createdAt: 1649095557367,
        updatedAt: 1649095557367,
        id: 26,
        name: 'Economy',
      },
    },
  ],
  'position-110':
    "I believe that public officials should be held to the highest standards of integrity and transparency, and this includes members of Congress. The trust of the public is paramount in maintaining a functional and accountable government.\n\nThat being said, I support the idea of a Congressional Stock Ban. This would entail prohibiting members of Congress from trading individual stocks while in office, to avoid conflicts of interest and even the appearance of impropriety. Instead, they could invest in diversified funds or other investment vehicles that don't create a conflict between their personal financial interests and their duty to serve the public.\n\nAs a city council member, I wouldn't have direct influence over this federal legislation. However, I would advocate for similar measures at the local level to ensure that our elected officials in Aliso Viejo maintain a high level of integrity and transparency. I believe that it is important for those in public office to prioritize the public interest above personal gain, and a stock ban would be a step in the right direction toward achieving that goal.",
  'position-101':
    'I believe that a competitive marketplace is essential for fostering innovation, consumer choice, and economic growth. When monopolies or oligopolies dominate an industry, it can stifle competition and lead to higher prices, reduced quality, and fewer options for consumers.\n\nAs a city council member, my influence on breaking up monopolies at the national or international level would be limited. However, I would work within my capacity to promote fair competition and support local businesses in Aliso Viejo. Encouraging small businesses to thrive and ensuring that they have a level playing field is a vital part of maintaining a healthy local economy.\n\nAt the same time, I understand that collaboration and cooperation can lead to innovation and economies of scale. Therefore, I would advocate for a balanced approach that recognizes the benefits of both competition and collaboration while safeguarding consumer interests and promoting overall economic growth.',
  'position-13':
    "it can be an effective tool to address income inequality and provide additional funding for essential public services. However, it's crucial to implement it in a balanced and thoughtful manner to avoid discouraging entrepreneurship and innovation. When considering a wealth tax, we need to take into account its potential impact on economic growth, job creation, and the overall business environment. My primary focus is on ensuring that our community thrives, and I believe that any tax policy should be evaluated based on its ability to promote fairness, support social programs, and contribute to a healthy economy.",
};

let log = 'starting. ';
module.exports = {
  inputs: {
    email: {
      type: 'string',
      isEmail: true,
      required: true,
    },
  },

  exits: {},

  async fn(inputs, exits) {
    try {
      const { email } = inputs;
      // fix missing candidate positions for mateo
      const variables = JSON.stringify({
        name: 'User name',
        link: 'https://goodparty.org',
      });
      await sails.helpers.mailgun.mailgunTemplateSender(
        email,
        'Your Good Party Campaign is live!',
        'campagin-launch',
        variables,
      );

      return exits.success({
        message: 'Done',
        log,
      });
    } catch (e) {
      console.log('Error in seed', e);
      return exits.success({
        message: 'Error in seed',
        e,
        error: JSON.stringify(e),
        log,
      });
    }
  },
};

async function createCandidatePositions(topIssues, candidate) {
  for (let i = 0; i < topIssues.positions.length; i++) {
    log += `in loop ${i}
    `;
    const position = topIssues.positions[i];
    if (!position.topIssue) {
      continue;
    }
    log += `position: ${JSON.stringify(position)}`;

    if (position.id !== 'custom-id') {
      log += `creating candidate posistion with 
        description: ${topIssues[`position-${position.id}`]},
        candidate: ${candidate.id},
        position: ${position.id},
        topIssue: ${position.topIssue.id},
        order: ${i},
      `;
      await CandidatePosition.create({
        description: topIssues[`position-${position.id}`],
        candidate: candidate.id,
        position: position.id,
        topIssue: position.topIssue.id,
        order: i,
      });
      log += `after create
      `;
      await Candidate.addToCollection(candidate.id, 'positions', position.id);
      await Candidate.addToCollection(
        candidate.id,
        'topIssues',
        position.topIssue.id,
      );
      log += `after collection
      `;
    } else {
      const data = JSON.parse(candidate.data);

      const newIssue = {
        description: topIssues[`position-${position.id}`],
      };
      if (!data.customIssues) {
        data.customIssues = [];
      }

      data.customIssues.push(newIssue);

      await Candidate.updateOne({
        id: candidate.id,
      }).set({
        data: JSON.stringify(data),
      });
    }
  }
}

const tomerCampaign = {
  slug: 'tomer-almog',
  details: {
    firstName: 'Tomer',
    lastName: 'Almog',
    zip: '04654',
    dob: '1978-04-24',
    citizen: 'yes',
    party: 'Independent',
    otherParty: '',
    knowRun: 'yes',
    state: 'CA',
    office: 'Other',
    district: '17',
    articles: '',
    runBefore: 'no',
    officeRunBefore: '',
    pastExperience:
      'I have 5 years of experience on the local school board, where I worked to improve the quality of education by developing policies, securing funding, and establishing partnerships. This led to higher student achievement, increased graduation rates, and better school facilities. This experience has equipped me with the skills and commitment needed to serve as an elected official.',
    occupation: 'CTO of Good Party',
    funFact:
      "I love playing the guitar and writing songs in my free time. I've even performed at a few local open mic nights! Music has been a passion of mine for as long as I can remember, and I believe that it has helped me to develop creativity, perseverance, and a willingness to take risks. Whether writing a song or crafting a policy proposal, I bring the same enthusiasm and dedication to everything I do.",
    topIssues: {
      positions: [
        {
          createdAt: 1649095557495,
          updatedAt: 1649095557495,
          id: 133,
          name: 'Fund Public Schools',
          topIssue: {
            createdAt: 1649095557491,
            updatedAt: 1649095557491,
            id: 29,
            name: 'Education',
          },
        },
        {
          createdAt: 1649095557510,
          updatedAt: 1649095557510,
          id: 137,
          name: 'Stop Book Bans',
          topIssue: {
            createdAt: 1649095557491,
            updatedAt: 1649095557491,
            id: 29,
            name: 'Education',
          },
        },
        {
          createdAt: 1649095557036,
          updatedAt: 1649095557036,
          id: 36,
          name: 'Defend 2nd Amendment',
          topIssue: {
            createdAt: 1649095557031,
            updatedAt: 1649095557031,
            id: 14,
            name: 'Guns',
          },
        },
        {
          createdAt: 1649095557573,
          updatedAt: 1649095557573,
          id: 154,
          name: 'Breakup Big Banks',
          topIssue: {
            createdAt: 1649095557558,
            updatedAt: 1649095557558,
            id: 32,
            name: 'Banking',
          },
        },
      ],
      'position-133': 'Public school needs more funding.',
      'position-12': 'Too many taxes!',
      'position-137': 'This is the first sign of Tyrany and fear',
      'position-36': 'Guns are necessary for democracy',
      'position-154': 'sss',
    },
    pledged: true,
    otherOffice: 'This is the other office',
    city: 'Los Angeles',
  },
  goals: {
    filedStatement: 'yes',
    campaignCommittee: 'committee of JavaScript',
    electionDate: '2023-11-25',
    runningAgainst: [
      {
        name: 'John Smith',
        description: 'John Smith is a corrupt politician ',
        party: 'Democrat Party',
      },
    ],
  },
  campaignPlanStatus: {
    timeline: 'completed',
    policyPlatform: 'completed',
    communicationsStrategy: 'completed',
    slogan: 'completed',
    pathToVictory: 'completed',
    getOutTheVote: 'completed',
    operationalPlan: 'completed',
    mobilizing: 'completed',
    aboutMe: 'completed',
    why: 'completed',
    messageBox: 'completed',
    socialMediaCopy: 'completed',
    candidateWebsite: 'completed',
    socialMediaCopy2: 'completed',
    launchEmail: 'completed',
    launchVideoScript: 'completed',
  },
  campaignPlan: {
    communicationsStrategy:
      '<div class="bg-blue-600 text-white py-4 px-8 rounded-lg">\n  <h1 class="text-3xl font-bold mb-2">Tomer Almog for US Senate</h1>\n  <p class="text-sm font-bold">Independent Candidate</p>\n</div>\n\n<div class="my-8">\n  <h2 class="text-2xl font-bold mb-4">About Tomer Almog</h2>\n  <p class="text-lg mb-4 leading-relaxed">Tomer Almog is a successful CTO of Good Party and a passionate musician who has performed at several local open mic nights. Throughout his five years of experience on the local school board, he has worked towards improving the quality of education through developing policies, securing funding, and establishing partnerships. Tomer\'s commitment and skills in this area make him the right candidate to fight for our children\'s education.</p>\n  <p class="text-lg leading-relaxed">Tomer Almog brings enthusiasm and dedication to everything he does, whether it\'s writing a song or crafting policy proposals. He believes that his passion for music has helped him develop creativity, perseverance, and a willingness to take risks.</p>\n</div>\n\n<div class="my-8">\n  <h2 class="text-2xl font-bold mb-4">Why Tomer Almog is Running?</h2>\n  <p class="text-lg leading-relaxed">Tomer Almog cares deeply about public schools and education. As an experienced school board member, he has seen the difference that good policies, adequate funding, and community involvement can make. Tomer is running for US Senate to continue his work towards education policies that benefit children and families across the state.</p>\n</div>\n\n<div class="my-8">\n  <h2 class="text-2xl font-bold mb-4">The Race</h2>\n  <p class="text-lg leading-relaxed">Tomer Almog is running as an independent candidate in the US Senate election against John Smith, who represents the corrupt Democrat Party. With his proven track record of being an honest and dedicated public servant, Tomer Almog is the clear choice in this election.</p>\n  <p class="text-lg leading-relaxed">Make sure to vote for Tomer Almog on November 23, 2023, and together we can keep dishonest politicians out of office and make a positive impact on public education. </p>\n</div>',
    slogan: '"Tomer Almog: Not in a Party, But Always Ready to Rock!"',
    pathToVictory:
      '<div>\n  <h2 class="font-bold text-lg mb-2">Field Plan for Tomer Almog\'s US Senate Campaign</h2>\n  <h3 class="font-bold text-md mb-2">Targeting Independent Voters</h3>\n  <p class="mb-2">Our first priority is to target the 100 registered Independent voters. Our field plan will focus on:</p>\n  <ul class="list-disc ml-6 mb-2">\n    <li>Setting up a phone banking system to reach out to Independent voters and encourage them to vote for Tomer Almog.</li>\n    <li>Having volunteers go door-to-door in key Independent precincts to inform them of Tomer Almog\'s platform and encourage them to vote.</li>\n  </ul>\n  \n  <h3 class="font-bold text-md mb-2">Building Support Among Republican Voters</h3>\n  <p class="mb-2">While the area has more registered Republicans than Democrats and Independents combined, we believe we can secure a portion of this vote by focusing on:</p>\n  <ul class="list-disc ml-6 mb-2">\n    <li>Setting up a booth at the local farmer\'s market to connect with Republican voters and share Tomer Almog\'s values and policies. </li>\n    <li>Hosting small meet-and-greet events with Republican voters in the community to build personal relationships with voters and address their concerns.</li>\n    <li>Placing ads in local radio stations and community newspapers targeted towards Republican voters to raise awareness of Tomer Almog\'s platform.</li>\n  </ul>\n\n  <h3 class="font-bold text-md mb-2">Winning Over Democratic Voters</h3>\n  <p class="mb-2">Although there are fewer registered Democratic voters in the area, we still believe it is important to reach out to this voter base through:</p>\n  <ul class="list-disc ml-6 mb-2">\n    <li>Participating in local town hall meetings and other events to introduce Tomer Almog\'s platform and engage with Democratic voters in the community.</li>\n    <li>Partnering with local Democratic organizations and leaders to build alliances and increase visibility among the party.</li>\n    <li>Running ads and placing campaign materials in traditionally Democratic areas to ensure that they are aware of Tomer Almog\'s candidacy and his vision for the Senate.</li>\n  </ul>\n  \n  <h3 class="font-bold text-md mb-2">Overall Turnout Plan</h3>\n  <p class="mb-2">To achieve the win number of 25.5, we need to have at least 50 registered voters turn out to vote in the election. Our strategy for increasing turnout is:</p>\n  <ul class="list-disc ml-6 mb-2">\n    <li>Engage with voters via social media and targeted email campaigns to remind them of the election date and Tomer Almog\'s candidacy.</li>\n    <li>Have volunteers put up yard signs and door hangers throughout the area to increase visibility and remind voters to vote on election day.</li>\n    <li>Set up a volunteer-led transportation program to help voters who need assistance getting to the polling location.</li>\n  </ul>\n\n</div>',
    policyPlatform:
      '<div class="bg-gray-200 p-4 rounded-lg">\n  <h2 class="text-2xl font-bold mb-4">Tomer Almog\'s Policy Platform</h2>\n  <h3 class="text-lg font-semibold mb-2">1. Fund Public Schools (Education)</h3>\n  <ul class="list-disc ml-6 mb-4">\n    <li>Invest in teacher training and development programs to ensure quality education.</li>\n    <li>Secure funding for school infrastructure and technology upgrades.</li>\n    <li>Create partnerships with local businesses and organizations to provide resources and opportunities for students.</li>\n  </ul>\n  <h3 class="text-lg font-semibold mb-2">2. Stop Book Bans (Education)</h3>\n  <ul class="list-disc ml-6 mb-4">\n    <li>Oppose any legislation or policies that seek to ban or censor books in school libraries.</li>\n    <li>Champion the importance of diverse and inclusive literature in education.</li>\n    <li>Work with educators and school boards to provide resources for teachers to incorporate diverse literature into their curriculum.</li>\n  </ul>\n  <h3 class="text-lg font-semibold mb-2">3. Defend 2nd Amendment (Guns)</h3>\n  <ul class="list-disc ml-6 mb-4">\n    <li>Protect the rights of law-abiding citizens to own firearms for self-defense and recreation.</li>\n    <li>Oppose any legislation or policies that seek to limit or penalize legal gun ownership.</li>\n    <li>Promote responsible gun ownership through education and training programs.</li>\n  </ul>\n</div>',
    getOutTheVote:
      '<div class="flex flex-col items-center justify-center mx-auto my-8">\n  <h2 class="text-2xl font-bold mb-4">Get out the Vote for Tomer Almog!</h2>\n  <img src="https://via.placeholder.com/200" alt="Tomer Almog for Senate" class="rounded-full mb-4">\n  <p class="text-center mb-4">Tomer Almog is an experienced CTO of Good Party and a passionate advocate for education. Let\'s help him win the US Senate race against corrupt politician John Smith!</p>\n  <h3 class="text-lg font-bold mb-2">Tactics:</h3>\n  <ol class="list-decimal px-4">\n    <li class="my-2">Host "Jam for Tomer" events where Tomer can showcase his musical talents and discuss his policies with voters</li>\n    <li class="my-2">Partner with local schools and parent-teacher associations to promote Tomer\'s commitment to fund public schools</li>\n    <li class="my-2">Organize phone banks to encourage supporters to get out and vote on Election Day</li>\n    <li class="my-2">Distribute flyers with information on Tomer\'s policies and voting information</li>\n    <li class="my-2">Collaborate with local businesses to display posters and host meet-and-greet events with Tomer</li>\n  </ol>\n  <p class="text-center font-bold mt-4">Let\'s make a difference and elect Tomer Almog to the US Senate!</p>\n</div>',
    timeline:
      'Here\'s a corrected response with the requested information:\n\n<div class="bg-white p-4 rounded-lg shadow-md">\n    <h1 class="text-2xl font-bold mb-4">Tomer Almog\'s US Senate Campaign Plan Timeline</h1>\n    <p class="mb-4">Election Day: November 23, 2023</p>\n\n    <h2 class="text-xl font-bold mb-2">Week of Election Day</h2>\n    <ul class="list-disc ml-8 mb-4">\n        <li>Mobilize volunteers and supporters for Election Day activities such as poll monitoring and maximizing turnout efforts.</li>\n        <li>Conduct final campaign events while adhering to election laws and regulations.</li>\n        <li>Finalize get-out-the-vote efforts that leverage digital and field operations to drive planned turnout (e.g. ride to polls programs, push notifications).</li>\n    </ul>\n\n    <h2 class="text-xl font-bold mb-2">Two Weeks Prior to Election Day</h2>\n    <ul class="list-disc ml-8 mb-4">\n        <li>Continue to leverage digital, field, and traditional media to reach out to voters, focusing on demographic groups where turnout is historically underwhelming.</li>\n        <li>Host final rallies in key media markets and bring out significant local supporters, labor groups or party officials.</li>\n        <li>Continue voter registration efforts in states that allow same day voter registration.</li>\n    </ul>\n\n    <h2 class="text-xl font-bold mb-2">Four Weeks Prior to Election Day</h2>\n    <ul class="list-disc ml-8 mb-4">\n        <li>Launch the final phase of TV and digital advertising campaigns while developing earned and social media initiatives.</li>\n        <li>Process absentee or early voting ballots by encouraging supporters to return their ballots as soon as they arrive using email, texts, and phone calls.</li>\n        <li>Continue voter registration efforts and register underrepresented groups that support the candidate.</li>\n    </ul>\n\n    <h2 class="text-xl font-bold mb-2">Six Weeks Prior to Election Day</h2>\n    <ul class="list-disc ml-8 mb-4">\n        <li>Release the candidate\'s economic policies and highlight Tomer Almog\'s CTO experience and the impact of STEM in his vision for American workers.</li>\n        <li>Debate preparation and playbook refinement.</li>\n        <li>Earned media opportunities targeting early voting states and voter registration deadlines.</li>\n    </ul>\n\n    <h2 class="text-xl font-bold mb-2">Eight Weeks Prior to Election Day</h2>\n    <ul class="list-disc ml-8 mb-4">\n        <li>Announce specific education policy proposals to improve public schools in the United States.</li>\n        <li>Debate preparation and opposition research.</li>\n        <li>Develop earn media content highlighting Tomer Almog\'s passion for music and the arts and the impact it has had on his life and community.</li>\n    </ul>\n\n    <h2 class="text-xl font-bold mb-2">Ten Weeks Prior to Election Day</h2>\n    <ul class="list-disc ml-8 mb-4">\n        <li>Launch the first wave of TV, digital, and mailer ads targeting key constituencies.</li>\n        <li>Develop field operations in competitive states or counties, and hire necessary field staff.</li>\n        <li>Work with political party factions and interest groups that align with independent views to distribute targeted ads and messaging to those audiences.</li>\n    </ul>\n\n    <h2 class="text-xl font-bold mb-2">Twelve Weeks Prior to Election Day</h2>\n    <ul class="list-disc ml-8 mb-4">\n        <li>Begin door-to-door canvassing and phone banking to identify and persuade voters to support Tomer Almog\'s campaign, leveraging strong messaging utilizing independent values and policies.</li>\n        <li>Develop an independent campaign platform using values like transparency, accountability, and respect for all members of the community regardless of political affiliation.</li>\n        <li>Conduct interviews with local media outlets to introduce Tomer Almog and establish credibility to voters.</li>\n    </ul>\n</div>',
    mobilizing:
      'Here\'s a political field plan based on the information you provided for Tomer Almog:\n\n<h1 class="text-3xl font-bold mb-4">Tomer Almog\'s Political Field Plan</h1>\n\n<h2 class="text-xl font-bold mb-2">1. Voter Targeting</h2>\n\n<p class="mb-4">Based on Tomer Almog\'s campaign platform as an independent candidate who cares about quality education, leading with integrity, and creating positive change, here are our suggestions on voter targeting:</p>\n\n<ul class="list-disc list-inside mb-6">\n  <li><strong>Base Voters:</strong> We suggest targeting independent voters who are looking for an alternative to traditional party politics. Given Tomer\'s background in education, we also suggest focusing on parents and educators.</li>\n  <li><strong>Sway Voters:</strong> We suggest focusing outreach on Democrats who are disillusioned with their party, particularly those in the 20-70 age range and women. For Republicans, we suggest targeting those who prioritize education and second amendment rights.</li>\n  <li><strong>Avoid:</strong> Based on our analysis, we recommend avoiding Democratic voters who are highly loyal to their party and less likely to consider an independent candidate.</li>\n  <li><strong>Demographic Focus:</strong> Our outreach efforts will focus on people in the 20-70 age range, with a slightly higher emphasis on women than men. We will also focus on party affiliation, with a stronger emphasis on Independents and Republicans.</li>\n</ul>\n\n<h2 class="text-xl font-bold mb-2">2. Canvassing Strategy</h2>\n\n<p class="mb-4">Based on our analysis, here is our proposed canvassing strategy:</p>\n\n<ul class="list-disc list-inside mb-6">\n  <li><strong>Timeline:</strong> We recommend starting canvassing efforts at least 6 months before the election date and ramping up as we approach election day. This gives our volunteers enough time to reach out to voters and build up name recognition for Tomer.</li>\n  <li><strong>Weekly Goals:</strong> We recommend knocking on 1000 doors per week to maximize our reach and connect with potential voters.</li>\n  <li><strong>Volunteer Recruitment:</strong> We recommend recruiting and training volunteers from local communities who have a vested interest in supporting our campaign. We will also work with local advocacy groups and organizations to identify potential volunteers.</li>\n  <li><strong>Materials:</strong> We will provide volunteers with scripts, literature and other campaign materials to help them engage with voters in a meaningful way.</li>\n</ul>\n\n<h2 class="text-xl font-bold mb-2">3. Phone Banking</h2>\n\n<p class="mb-4">Based on our analysis, here is our proposed phone banking strategy:</p>\n\n<ul class="list-disc list-inside mb-6">\n  <li><strong>Timeline:</strong> We recommend starting phone banking efforts 6 months before the election and increasing outreach as we get closer to the election date.</li>\n  <li><strong>Weekly Goals:</strong> We recommend making at least 4800 calls per week to reach our target audience.</li>\n  <li><strong>Volunteer Recruitment:</strong> We will recruit and train volunteers to make calls and provide them with scripts and other support materials.</li>\n  <li><strong>Contact Rate:</strong> We estimate that each volunteer can make at least 48 contacts per hour. Keeping our assumptions in line with this should secure success for these efforts.</li>\n</ul>\n\n<h2 class="text-xl font-bold mb-2">4. Voter Registration</h2>\n\n<p class="mb-4">Based on our analysis, here is how we plan to tackle voter registration:</p>\n\n<ul class="list-disc list-inside mb-6">\n  <li><strong>Timeline:</strong> We will prioritize voter registration efforts at the beginning and middle of our campaign time frame. We will also make a final push closer to the registration deadline.</li>\n  <li><strong>Outreach:</strong> We will work with local organizations to identify potential voters who are not yet registered and provide them with information about the registration process. We will also use our canvassing and phone banking efforts to encourage voter registration among our target audience.</li>\n</ul>\n\n<h2 class="text-xl font-bold mb-2">5. Get-Out-The-Vote (GOTV)</h2>\n\n<p class="mb-4">Based on our analysis, here is our proposed GOTV strategy:</p>\n\n<ul class="list-disc list-inside mb-6">\n  <li><strong>Timeline:</strong> We will focus on GOTV efforts in the final weeks leading up to the election, with particular emphasis on the weekend before the election.</li>\n  <li><strong>Outreach:</strong> We will remind supporters to vote via phone and email, and also provide them with information about polling locations and hours. We will also provide transportation to polling locations for those who need it.</li>\n  <li><strong>Increase in voter turnout:</strong> Based on our analysis and past election results, we estimate that our efforts can feasibly increase supportive voter turnout by 2% to 5%. While this may not seem very high, it can make a big difference in a close race.</li>\n</ul>\n\n<h2 class="text-xl font-bold mb-2">6. Data Management</h2>\n\n<p class="mb-4">Managing data is crucial for any political campaign. Here\'s how we plan to manage our data:</p>\n\n<ul class="list-disc list-inside mb-6">\n  <li><strong>Data tracking:</strong> We will track data related to voter contact information, canvassing results, phone banking results and other relevant metrics to help us target our outreach efforts more effectively.</li>\n  <li><strong>Data reporting:</strong> We will regularly report on our data to identify trends and course-correct where necessary.</li>\n</ul>\n\n<h2 class="text-xl font-bold mb-2">Conclusion</h2>\n\n<p class="mb-4">We believe that our comprehensive field plan, which includes voter targeting, canvassing, phone banking, voter registration and GOTV efforts, will increase our chances of victory in the upcoming US Senate election. By using data-driven tactics and working closely with our volunteers and supporters, we are confident that we can create a positive change for the future.</p>\n\n<a href="#" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">\n  Join Team Almog!\n</a>',
    operationalPlan:
      '<h1 class="text-3xl font-bold">Operational Plan for Tomer Almog for US Senate</h1>\n\n<h2 class="text-xl font-bold mt-8">Goals</h2>\n<ul class="list-disc list-inside">\n    <li>Win the US Senate race against John Smith</li>\n    <li>Focus on Fund Public Schools (Education)</li>\n    <li>Establish strong partnerships to achieve educational reform</li>\n</ul>\n\n<h2 class="text-xl font-bold mt-8">Budget</h2>\n<p>The budget for Tomer Almog\'s US Senate race will be approximately $2 million. This budget will be used for the following expenses:</p>\n<ul class="list-disc list-inside">\n    <li>Salaries for campaign staff (<strong>$500,000</strong>)</li>\n    <li>Advertising and marketing (<strong>$750,000</strong>)</li>\n    <li>Travel expenses (<strong>$100,000</strong>)</li>\n    <li>Event planning and execution (<strong>$300,000</strong>)</li>\n    <li>Office expenses and rent (<strong>$250,000</strong>)</li>\n</ul>\n\n<h2 class="text-xl font-bold mt-8">Staffing Structure</h2>\n<p>Tomer Almog\'s campaign will require a dedicated team of staff members. The following positions will be needed:</p>\n<ul class="list-disc list-inside">\n    <li>Campaign Manager</li>\n    <li>Communications Director</li>\n    <li>Fundraising Director</li>\n    <li>Field Director</li>\n    <li>Volunteer Coordinator</li>\n    <li>Finance Director</li>\n    <li>Policy Advisor</li>\n</ul>\n<p>Each staff member will have specific roles and responsibilities, as outlined by Tomer Almog\'s campaign. Salaries and benefits will be competitive and based on experience and skill level.</p>',
    aboutMe:
      '<div class="bg-blue-200 p-5 rounded-lg">\n    <h2 class="text-2xl font-bold mb-5">About Me</h2>\n    <p class="mb-5"><span class="font-bold">My name is Tomer Almog</span>, and I\'m running for US Senate as a member of the Independent/None party. As the CTO of Good Party, I have experience leading teams to accomplish important goals, and I\'m ready to bring that same leadership to the Senate. </p>\n    \n    <p class="mb-5">In my free time, I love playing the guitar and writing songs. Music has been a passion of mine for as long as I can remember, and I believe it has helped me to develop important skills like creativity, perseverance, and willingness to take risks. Whether crafting a song or a policy proposal, I bring the same enthusiasm and dedication to everything I do.</p>\n    \n    <p class="mb-5">I have also served on the local school board for 5 years, where I worked hard to improve the quality of education. I developed policies, secured funding, and established partnerships to increase student achievement, graduation rates, and school facilities. This experience has equipped me with the skills and commitment needed to serve as an elected official in the Senate.</p>\n    \n    <p class="mb-5"><span class="font-bold">My priorities include:</span></p>\n    <ul class="list-disc pl-5 mb-5">\n        <li>Fund Public Schools (Education)</li>\n        <li>Stop Book Bans (Education)</li>\n        <li>Defend 2nd Amendment (Guns)</li>\n    </ul>\n    \n    <p class="mb-5">In the 2023-11-23 election, I am running against John Smith, a corrupt politician from the Democrat Party. I believe that the people of this state deserve better than a corrupt politician, and I am ready to fight for them. So please, vote for me, Tomer Almog, for US Senate on Election Day.</p><p class="mb-5"><br></p><p class="mb-5">sddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsdddddddddddd</p>\n</div>',
    why: '<div class="text-center">\n  <h2 class="font-bold text-2xl">Why I\'m Running for US Senate</h2>\n  <h3 class="font-medium text-lg">By Tomer Almog, Independent</h3>\n</div>\n\n<div class="mt-4">\n  <h4 class="font-medium text-lg">1My Background</h4>\n  <p>I am Tomer Almog, the CTO of Good Party. I am running for US Senate as an Independent candidate. Outside of politics, I am a musician at heart and enjoy playing the guitar and writing songs in my free time. I believe that my passion for music has helped me develop important qualities such as creativity, perseverance, and risk-taking, which are advantageous traits for a public servant.</p>\n</div>\n\n<div class="mt-4">\n  <h4 class="font-medium text-lg">My Experience</h4>\n  <p>I have five years of experience on the local school board where I worked hard to develop policies, secure funding, and establish partnerships that improved the quality of education, leading to higher student achievement, increased graduation rates, and better school facilities. This experience equipped me with the necessary skills and commitment to serve as an elected official.</p>\n</div>\n\n<div class="mt-4">\n  <h4 class="font-medium text-lg">My Agenda</h4>\n  <ul>\n    <li>\n      <p class="font-semibold">Fund Public Schools (Education)</p>\n      <p>As a member of the local school board, I have seen firsthand the impact that underfunded schools have on the quality of education. I will work hard to secure more funding for public schools so that every student has access to a quality education.</p>\n    </li>\n    <li>\n      <p class="font-semibold">Stop Book Bans (Education)</p>\n      <p>Our country was founded on the principles of free speech and open debate. I believe that every student should have access to diverse perspectives on important issues. I will oppose any attempts to ban books or limit academic freedom.</p>\n    </li>\n    <li>\n      <p class="font-semibold">Defend 2nd Amendment (Guns)</p>\n      <p>I support the Second Amendment and believe that law-abiding citizens have the right to bear arms. I will work to protect our constitutional rights while also addressing the issue of gun violence in our communities.</p>\n    </li>\n  </ul>\n</div>\n\n<div class="mt-4">\n  <p class="font-bold">I am running for US Senate because I want to make a positive impact in our communities. As an Independent candidate, I am free from partisan politics and will always put the needs of the people above party interests. I promise to work hard, listen to your concerns, and fight for policies that will benefit all Americans. Thank you for your support!</p>\n</div>',
    messageBox:
      '<div class="grid grid-cols-2 gap-4">\n\n  <div class="bg-green-300 p-4">\n    <h1 class="font-bold text-lg mb-4">What I will say about myself</h1>\n    <ul>\n      <li>I\'m Tomer Almog, an independent candidate running for the US Senate.</li>\n      <li>I have years of experience on the local school board, where I worked to improve the quality of education.</li>\n      <li>I\'m a CTO of Good Party and my passion is music, which has helped me develop creativity, perseverance, and a willingness to take risks.</li>\n      <li>I care deeply about funding public schools, stopping book bans, and defending the 2nd amendment.</li>\n    </ul>\n  </div>\n\n  <div class="bg-red-300 p-4">\n    <h1 class="font-bold text-lg mb-4">What I will say about my opponent</h1>\n    <ul>\n      <li>My opponent, John Smith, is a corrupt politician.</li>\n      <li>He\'s from the Democrat Party and is beholden to special interests and big money donors.</li>\n      <li>He\'ll say and do anything to win, regardless of the ethical implications.</li>\n      <li>He has a long history of supporting policies that harm constituents and put profits over people.</li>\n    </ul>\n  </div>\n\n  <div class="bg-blue-300 p-4">\n    <h1 class="font-bold text-lg mb-4">What my opponent will say about me</h1>\n    <ul>\n      <li>Tomer Almog is a fringe candidate with no real place in the political landscape.</li>\n      <li>He\'s too inexperienced and has no real grasp on how to get things done in Congress.</li>\n      <li>His policies are unrealistic and would never be able to pass in a divided government.</li>\n      <li>He\'s too focused on music and other extracurricular activities to take the job of US Senator seriously.</li>\n    </ul>\n  </div>\n\n  <div class="bg-yellow-300 p-4">\n    <h1 class="font-bold text-lg mb-4">What my opponent will say about themselves</h1>\n    <ul>\n      <li>John Smith is the only candidate with the experience and know-how to get things done in Congress.</li>\n      <li>He\'s committed to fighting for the people, not special interests or big money donors.</li>\n      <li>His policies are realistic and will bring about the changes that constituents need most.</li>\n      <li>He has a proven track record of success and has always put the needs of his constituents first.</li>\n    </ul>\n  </div>\n\n</div>',
  },
  pathToVictory: {
    totalRegisteredVoters: '1000',
    projectedTurnout: '50',
    winNumber: 26,
    voterContactGoal: '185000',
    republicans: '500',
    democrats: '400',
    indies: '100',
    averageTurnout: '33',
    allAvailVoters: 0,
    availVotersTo35: 0,
    women: '60',
    men: '40',
    africanAmerican: '20',
    white: '30',
    asian: '20',
    hispanic: '30',
    voteGoal: '3000',
    voterProjection: '2800',
    budgetLow: 0,
    budgetHigh: 0,
    voterMap:
      'https://www.google.com/maps/d/embed?mid=1tY1TYLxD87Pnw900nZVTyX2YxGKH7f4&ehbc=2E312F',
    ageMin: '20',
    ageMax: '70',
  },
  image:
    'https://assets.goodparty.org/candidate-info/f157e110-2c49-4045-8e80-4e89f65ad97e.jpeg',
  hubspotId: '15631267201',
  team: { completed: true },
  social: { completed: true },
  finance: { ein: true, management: true, regulatory: true, filing: true },
  launch: {
    'website-1': true,
    'media-0': true,
    'media-1': true,
    'media-2': true,
    'media-3': true,
    'media-4': true,
    'socialMedia-0': true,
    'socialMedia-1': true,
    'email-1': true,
    'launchEvent-0': true,
    'launchEvent-1': true,
    'launchEvent-2': true,
    'launchEvent-3': true,
    'launchEvent-4': true,
    'launchEvent-5': true,
    'launchEvent-6': true,
  },
  launched: true,
  profile: { completed: true },
  currentStep: 'launch-16',
  color: '#EA932D',
  aiContent: {
    socialMediaCopy: {
      name: 'Social Media Copy',
      updatedAt: '2023-08-18',
      content:
        '<div class="p-4 border border-gray-400">\n  Why don\'t scientists trust atoms? Because they make up everything.123 tttasd asd</div>',
    },
    candidateWebsite: {
      name: 'Candidate Website',
      content:
        '<div class="text-center text-xl font-bold text-blue-500">Why did the tomato turn red?</div>\n<div class="text-center text-lg text-gray-700">Because it saw the salad dressing!</div>',
      updatedAt: 1692374180664,
    },
    socialMediaCopy2: {
      name: 'Social Media Copy2',
      content:
        '<div class="p-4">\n  <h2 class="text-3xl font-bold pb-4">Get Tomer Almog Elected as the First Independent Senator!</h2>\n  \n  <div class="grid grid-cols-2 gap-4">\n    <div>\n      <div class="bg-gray-100 rounded-lg p-4">\n        <h3 class="text-xl font-bold pb-2">Instagram Story</h3>\n        <p class="pb-2">Swipe up to learn how you can help get an independent voice in the US Senate!</p>\n        <p class="pb-2">Don\'t let the two-party system control our democracy.</p>\n        <p class="pb-2">Vote for Tomer Almog!</p>\n        <a href="#" class="bg-blue-500 text-white rounded-lg px-4 py-2 inline-block">Learn More</a>\n      </div>\n    </div>\n    <div>\n      <div class="bg-gray-100 rounded-lg p-4">\n        <h3 class="text-xl font-bold pb-2">YouTube Video Script</h3>\n        <p class="pb-2">Are you sick of the same old politicians in the US Senate?</p>\n        <p class="pb-2">Meet Tomer Almog, the independent candidate who will fight for your voice to be heard.</p>\n        <p class="pb-2">Join Tomer\'s movement and help us bring diversity, fresh ideas, and real change to Washington.</p>\n        <a href="#" class="text-blue-500 font-bold hover:underline">Watch Now</a>\n      </div>\n    </div>\n    <div>\n      <div class="bg-gray-100 rounded-lg p-4">\n        <h3 class="text-xl font-bold pb-2">LinkedIn Blog Post</h3>\n        <p class="pb-2">As an independent candidate for US Senate, I am proud to represent the voice of the people, not the special interests.</p>\n        <p class="pb-2">It\'s time for a change in Washington, and I am ready to lead the charge.</p>\n        <p class="pb-2">Join me in this fight to bring real democracy and fairness to the people.</p>\n        <a href="#" class="bg-blue-500 text-white rounded-lg px-4 py-2 inline-block">Read More</a>\n      </div>\n    </div>\n    <div>\n      <div class="bg-gray-100 rounded-lg p-4">\n        <h3 class="text-xl font-bold pb-2">Twitter Thread</h3>\n        <p class="pb-2">The two-party system has failed us for too long.</p>\n        <p class="pb-2">It\'s time for an independent voice in the US Senate.</p>\n        <p class="pb-2">Join the movement and help get Tomer Almog elected!</p>\n        <a href="#" class="text-blue-500 font-bold hover:underline">#VoteTomerAlmog</a>\n      </div>\n    </div>\n    <div>\n      <div class="bg-gray-100 rounded-lg p-4">\n        <h3 class="text-xl font-bold pb-2">Facebook Post</h3>\n        <p class="pb-2">Attention all voters who are tired of the same old politics:</p>\n        <p class="pb-2">Join us and support Tomer Almog, the first independent candidate for US Senate!</p>\n        <p class="pb-2">Let\'s break the two-party system and bring real change to the people.</p>\n        <a href="#" class="text-blue-500 font-bold hover:underline">Learn More</a>\n      </div>\n    </div>\n    <div>\n      <div class="bg-gray-100 rounded-lg p-4">\n        <h3 class="text-xl font-bold pb-2">Reddit Post</h3>\n        <p class="pb-2">Hey, Reddit community! Let\'s be the change we want to see in the world.</p>\n        <p class="pb-2">Join us and support Tomer Almog, the independent candidate for US Senate who truly represents the people.</p>\n        <a href="#" class="text-blue-500 font-bold hover:underline">Vote for Tomer</a>\n      </div>\n    </div>\n    <div>\n      <div class="bg-gray-100 rounded-lg p-4">\n        <h3 class="text-xl font-bold pb-2">Discord Post</h3>\n        <p class="pb-2">Calling all members of the Discord community who value diversity and fresh ideas.</p>\n        <p class="pb-2">Join us and support Tomer Almog, the independent candidate for US Senate who will fight for our voice to be heard.</p>\n        <a href="#" class="text-blue-500 font-bold hover:underline">Join the Movement</a>\n      </div>\n    </div>\n  </div>\n\n  <div class="pt-6">\n    <h4 class="font-bold pb-2">Join the conversation:</h4>\n    <p class="pb-2">What inspired you to consider voting for an independent candidate?</p>\n    <p class="pb-2">What do you think are the most important issues that an independent senator would bring to the table?</p>\n  </div>\n</div>',
      updatedAt: 1692374180664,
    },
    launchEmail: {
      name: 'Launch Email',
      content:
        '<div class="p-10 text-center text-2xl text-purple-600">\nWhy did the tomato turn red?\nBecause it saw the salad dressing!123</div>',
      updatedAt: 1692374180664,
    },
    launchVideoScript: {
      name: 'Launch Video Script',
      content:
        '<div class="p-5 text-center text-xl font-bold text-purple-600">Why don\'t scientists trust atoms?<br>Because they make up everything.</div>',
      updatedAt: 1692374180664,
    },
  },
  lastStepDate: '2023-06-27',
  reportedVoterGoals: { doorKnocking: 100, calls: 0, digital: 0 },
  lastVisited: 1692589782767,
  launchStatus: 'pending',
};
