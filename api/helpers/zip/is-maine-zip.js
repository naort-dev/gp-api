// https://developers.hubspot.com/docs/api/crm/contacts

const maineZips = {
  '03901': true,
  '03902': true,
  '03903': true,
  '03904': true,
  '03905': true,
  '03906': true,
  '03907': true,
  '03908': true,
  '03909': true,
  '03910': true,
  '03911': true,
  '04001': true,
  '04002': true,
  '04003': true,
  '04005': true,
  '04006': true,
  '04008': true,
  '04009': true,
  '04010': true,
  '04011': true,
  '04015': true,
  '04017': true,
  '04019': true,
  '04020': true,
  '04021': true,
  '04022': true,
  '04024': true,
  '04027': true,
  '04029': true,
  '04030': true,
  '04032': true,
  '04037': true,
  '04038': true,
  '04039': true,
  '04040': true,
  '04041': true,
  '04042': true,
  '04043': true,
  '04046': true,
  '04047': true,
  '04048': true,
  '04049': true,
  '04050': true,
  '04051': true,
  '04055': true,
  '04056': true,
  '04057': true,
  '04061': true,
  '04062': true,
  '04063': true,
  '04064': true,
  '04066': true,
  '04068': true,
  '04069': true,
  '04071': true,
  '04072': true,
  '04073': true,
  '04074': true,
  '04076': true,
  '04079': true,
  '04083': true,
  '04084': true,
  '04085': true,
  '04086': true,
  '04087': true,
  '04088': true,
  '04090': true,
  '04091': true,
  '04092': true,
  '04093': true,
  '04095': true,
  '04096': true,
  '04097': true,
  '04101': true,
  '04102': true,
  '04103': true,
  '04105': true,
  '04106': true,
  '04107': true,
  '04108': true,
  '04109': true,
  '04110': true,
  '04210': true,
  '04216': true,
  '04217': true,
  '04219': true,
  '04220': true,
  '04221': true,
  '04222': true,
  '04224': true,
  '04226': true,
  '04227': true,
  '04231': true,
  '04234': true,
  '04236': true,
  '04237': true,
  '04238': true,
  '04239': true,
  '04240': true,
  '04250': true,
  '04252': true,
  '04253': true,
  '04254': true,
  '04255': true,
  '04256': true,
  '04257': true,
  '04258': true,
  '04259': true,
  '04260': true,
  '04261': true,
  '04263': true,
  '04265': true,
  '04267': true,
  '04268': true,
  '04270': true,
  '04274': true,
  '04275': true,
  '04276': true,
  '04280': true,
  '04281': true,
  '04282': true,
  '04284': true,
  '04285': true,
  '04287': true,
  '04289': true,
  '04290': true,
  '04292': true,
  '04294': true,
  '04330': true,
  '04342': true,
  '04344': true,
  '04345': true,
  '04346': true,
  '04347': true,
  '04348': true,
  '04349': true,
  '04350': true,
  '04351': true,
  '04352': true,
  '04353': true,
  '04354': true,
  '04355': true,
  '04357': true,
  '04358': true,
  '04359': true,
  '04360': true,
  '04363': true,
  '04364': true,
  '04401': true,
  '04406': true,
  '04408': true,
  '04410': true,
  '04411': true,
  '04412': true,
  '04413': true,
  '04414': true,
  '04415': true,
  '04416': true,
  '04417': true,
  '04418': true,
  '04419': true,
  '04421': true,
  '04422': true,
  '04424': true,
  '04426': true,
  '04427': true,
  '04428': true,
  '04429': true,
  '04430': true,
  '04431': true,
  '04434': true,
  '04435': true,
  '04438': true,
  '04441': true,
  '04442': true,
  '04443': true,
  '04444': true,
  '04448': true,
  '04449': true,
  '04450': true,
  '04451': true,
  '04453': true,
  '04454': true,
  '04455': true,
  '04456': true,
  '04457': true,
  '04459': true,
  '04460': true,
  '04461': true,
  '04462': true,
  '04463': true,
  '04464': true,
  '04468': true,
  '04469': true,
  '04471': true,
  '04472': true,
  '04473': true,
  '04474': true,
  '04475': true,
  '04476': true,
  '04478': true,
  '04479': true,
  '04481': true,
  '04485': true,
  '04487': true,
  '04488': true,
  '04489': true,
  '04490': true,
  '04491': true,
  '04492': true,
  '04493': true,
  '04495': true,
  '04496': true,
  '04497': true,
  '04530': true,
  '04535': true,
  '04537': true,
  '04538': true,
  '04539': true,
  '04541': true,
  '04543': true,
  '04544': true,
  '04547': true,
  '04548': true,
  '04551': true,
  '04553': true,
  '04554': true,
  '04555': true,
  '04556': true,
  '04558': true,
  '04562': true,
  '04563': true,
  '04564': true,
  '04568': true,
  '04571': true,
  '04572': true,
  '04573': true,
  '04574': true,
  '04575': true,
  '04576': true,
  '04578': true,
  '04579': true,
  '04605': true,
  '04606': true,
  '04607': true,
  '04609': true,
  '04611': true,
  '04612': true,
  '04613': true,
  '04614': true,
  '04616': true,
  '04617': true,
  '04619': true,
  '04622': true,
  '04623': true,
  '04624': true,
  '04625': true,
  '04626': true,
  '04627': true,
  '04628': true,
  '04630': true,
  '04631': true,
  '04634': true,
  '04635': true,
  '04637': true,
  '04640': true,
  '04642': true,
  '04643': true,
  '04645': true,
  '04646': true,
  '04648': true,
  '04649': true,
  '04650': true,
  '04652': true,
  '04653': true,
  '04654': true,
  '04655': true,
  '04657': true,
  '04658': true,
  '04660': true,
  '04662': true,
  '04664': true,
  '04666': true,
  '04667': true,
  '04668': true,
  '04669': true,
  '04671': true,
  '04673': true,
  '04674': true,
  '04675': true,
  '04676': true,
  '04677': true,
  '04679': true,
  '04680': true,
  '04681': true,
  '04683': true,
  '04684': true,
  '04685': true,
  '04686': true,
  '04691': true,
  '04693': true,
  '04694': true,
  '04730': true,
  '04732': true,
  '04733': true,
  '04734': true,
  '04735': true,
  '04736': true,
  '04739': true,
  '04740': true,
  '04741': true,
  '04742': true,
  '04743': true,
  '04745': true,
  '04746': true,
  '04747': true,
  '04750': true,
  '04756': true,
  '04757': true,
  '04758': true,
  '04760': true,
  '04761': true,
  '04762': true,
  '04763': true,
  '04764': true,
  '04765': true,
  '04766': true,
  '04768': true,
  '04769': true,
  '04772': true,
  '04773': true,
  '04774': true,
  '04776': true,
  '04777': true,
  '04779': true,
  '04780': true,
  '04781': true,
  '04783': true,
  '04785': true,
  '04786': true,
  '04787': true,
  '04841': true,
  '04843': true,
  '04847': true,
  '04848': true,
  '04849': true,
  '04851': true,
  '04852': true,
  '04853': true,
  '04854': true,
  '04855': true,
  '04856': true,
  '04858': true,
  '04859': true,
  '04860': true,
  '04861': true,
  '04862': true,
  '04863': true,
  '04864': true,
  '04901': true,
  '04910': true,
  '04911': true,
  '04912': true,
  '04915': true,
  '04917': true,
  '04918': true,
  '04920': true,
  '04921': true,
  '04922': true,
  '04923': true,
  '04924': true,
  '04925': true,
  '04926': true,
  '04927': true,
  '04928': true,
  '04929': true,
  '04930': true,
  '04932': true,
  '04933': true,
  '04936': true,
  '04937': true,
  '04938': true,
  '04939': true,
  '04941': true,
  '04942': true,
  '04943': true,
  '04944': true,
  '04945': true,
  '04947': true,
  '04949': true,
  '04950': true,
  '04951': true,
  '04952': true,
  '04953': true,
  '04955': true,
  '04956': true,
  '04957': true,
  '04958': true,
  '04961': true,
  '04962': true,
  '04963': true,
  '04964': true,
  '04965': true,
  '04966': true,
  '04967': true,
  '04969': true,
  '04970': true,
  '04971': true,
  '04973': true,
  '04974': true,
  '04975': true,
  '04976': true,
  '04978': true,
  '04979': true,
  '04981': true,
  '04982': true,
  '04983': true,
  '04984': true,
  '04985': true,
  '04986': true,
  '04987': true,
  '04988': true,
  '04989': true,
  '04992': true,
};
module.exports = {
  inputs: {
    zip: {
      type: 'string',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'ok',
    },

    badRequest: {
      description: 'Error',
    },
  },
  fn: async function(inputs, exits) {
    const { zip } = inputs;

    const inMaine = maineZips[zip];

    return exits.success(!!inMaine);
  },
};
