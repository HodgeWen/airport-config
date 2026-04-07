const RULES_BASE_URL =
  'https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash'

const ICON_BASE_URL =
  'https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color'

const REGION_GROUPS = [
  {
    name: '香港节点',
    icon: `${ICON_BASE_URL}/Hong_Kong.png`,
    filter: '(?i)港|HK|Hong\\s*Kong',
  },
  {
    name: '日本节点',
    icon: `${ICON_BASE_URL}/Japan.png`,
    filter: '(?i)日本|东京|大阪|泉日|埼玉|JP|Japan',
  },
  {
    name: '新加坡节点',
    icon: `${ICON_BASE_URL}/Singapore.png`,
    filter: '(?i)新加坡|狮城|SG|Singapore',
  },
  {
    name: '美国节点',
    icon: `${ICON_BASE_URL}/United_States.png`,
    filter:
      '(?i)美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United\\s*States',
  },
]

const regionNames = REGION_GROUPS.map((g) => g.name)

function buildProxyGroups() {
  const regionUrlTestGroups = REGION_GROUPS.map((g) => ({
    name: g.name,
    icon: g.icon,
    type: 'url-test',
    'include-all': true,
    filter: g.filter,
    interval: 300,
    tolerance: 50,
  }))

  return [
    {
      name: '节点选择',
      icon: `${ICON_BASE_URL}/Proxy.png`,
      type: 'select',
      proxies: [
        '延迟优先',
        'AI节点',
        ...regionNames,
        '手动切换',
        'DIRECT',
      ],
    },
    {
      name: '延迟优先',
      icon: `${ICON_BASE_URL}/Auto.png`,
      type: 'url-test',
      'include-all': true,
      interval: 300,
      tolerance: 50,
    },
    {
      name: 'AI节点',
      icon: `${ICON_BASE_URL}/Bot.png`,
      type: 'select',
      proxies: ['美国节点', '日本节点', '新加坡节点'],
    },
    ...regionUrlTestGroups,
    {
      name: '手动切换',
      icon: `${ICON_BASE_URL}/Static.png`,
      type: 'select',
      'include-all': true,
    },
    {
      name: '全球直连',
      icon: `${ICON_BASE_URL}/Direct.png`,
      type: 'select',
      proxies: ['DIRECT', '节点选择'],
    },
    {
      name: '广告拦截',
      icon: `${ICON_BASE_URL}/Advertising.png`,
      type: 'select',
      proxies: ['REJECT', 'DIRECT'],
    },
    {
      name: '漏网之鱼',
      icon: `${ICON_BASE_URL}/Final.png`,
      type: 'select',
      proxies: [
        '节点选择',
        '延迟优先',
        ...regionNames,
        '手动切换',
        'DIRECT',
      ],
    },
  ]
}

function ruleProvider(path, behavior = 'classical') {
  return {
    type: 'http',
    url: `${RULES_BASE_URL}/${path}`,
    path: `./ruleset/${path.split('/').pop()}`,
    behavior,
    format: 'text',
    interval: 86400,
  }
}

function buildRuleProviders() {
  return {
    LocalAreaNetwork: ruleProvider('LocalAreaNetwork.list'),
    UnBan: ruleProvider('UnBan.list'),
    BanAD: ruleProvider('BanAD.list'),
    BanProgramAD: ruleProvider('BanProgramAD.list'),
    GoogleCN: ruleProvider('GoogleCN.list'),
    'AI平台-国外': ruleProvider('Ruleset/AI.list'),
    ProxyGFWlist: ruleProvider('ProxyGFWlist.list'),
    ChinaDomain: ruleProvider('ChinaDomain.list', 'domain'),
    ChinaCompanyIp: ruleProvider('ChinaCompanyIp.list', 'ipcidr'),
    Download: ruleProvider('Download.list'),
  }
}

function buildRules() {
  return [
    'RULE-SET,LocalAreaNetwork,全球直连',
    'RULE-SET,UnBan,全球直连',
    'RULE-SET,BanAD,广告拦截',
    'RULE-SET,BanProgramAD,广告拦截',
    'RULE-SET,GoogleCN,全球直连',
    'RULE-SET,AI平台-国外,AI节点',
    'RULE-SET,ProxyGFWlist,节点选择',
    'RULE-SET,ChinaDomain,全球直连',
    'RULE-SET,ChinaCompanyIp,全球直连',
    'RULE-SET,Download,全球直连',
    'GEOIP,CN,全球直连',
    'MATCH,漏网之鱼',
  ]
}

const main = (config) => {
  config['proxy-groups'] = buildProxyGroups()
  config['rule-providers'] = buildRuleProviders()
  config['rules'] = buildRules()
  return config
}
