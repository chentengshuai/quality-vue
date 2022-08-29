import request from '@/utils/request'

// 获取班组信息下拉框列表
export function getDataTeamSelector() {
  return request({
    url: '/api/project/BizBaseDataTeam/Data/Selector',
    method: 'GET'
  })
}

// 获取班次信息下拉框列表
export function getDataClassesSelector() {
  return request({
    url: '/api/project/BizBaseDataClasses/Data/Selector',
    method: 'GET'
  })
}

// 获取单位信息下拉框列表
export function getDataUomSelector() {
  return request({
    url: '/api/project/Uom/Data/Selector',
    method: 'GET'
  })
}

// 获取工序信息下拉框列表
export function getDataProcessSelector() {
  return request({
    url: '/api/project/BdProductionProcess/Data/Selector',
    method: 'GET'
  })
}

// 获取设备信息下拉框列表
export function getDataEquipmentSelector(id) {
  return request({
    url: '/api/project/BdEquipment/Data/Selector/' + id,
    method: 'GET'
  })
}

// 获取制液系统信息下拉框列表
export function getDataLiquidSystemSelector() {
  return request({
    url: '/api/project/LiquidParameterConfig/Data/LiquidSystem/Selector',
    method: 'GET'
  })
}

// 获取制液检查项信息下拉框列表
export function getDataLiquidItemSelector() {
  return request({
    url: '/api/project/LiquidParameterConfig/Data/LiquidItem/Selector',
    method: 'GET'
  })
}

// 获取检测项信息下拉框列表
export function getDataItemSelector(typeName) {
  return request({
    url: '/api/project/BizTech/Item/Selector/' + typeName,
    method: 'GET'
  })
}

// 获取检测项信息下拉框列表
export function getDataItemOptionsSelector(techId, lineSeq) {
  return request({
    url: '/api/project/BizTech/Item/Selector/' + techId + '/' + lineSeq,
    method: 'GET'
  })
}

// 获取取样点信息下拉框列表
export function getDataSampleSelector(typeName) {
  return request({
    url: '/api/project/BizTech/Sample/Selector/' + typeName,
    method: 'GET'
  })
}

// 获取取样点信息下拉框列表
export function getDataExceptionCodeSelector(category, depth) {
  return request({
    url: '/api/project/ExceptionCode/Item/Selector',
    method: 'POST',
    params: {
      category: category,
      depth: depth,
    }
  })
}

// 获取取样点信息下拉框列表
export function getDataExceptionCodeSelectorView(category, code, depth) {
  return request({
    url: '/api/project/ExceptionCode/Item/SelectorView',
    method: 'POST',
    params: {
      category: category,
      code: code,
      depth: depth,
    }
  })
}

// 获取烘烤位下拉框列表
export function getDataBakeBitSelectorView(code) {
  return request({
    url: '/api/project/BdBakeBit/Data/Selector/'+code,
    method: 'get'
  })
}


// 打印  param:  a: 'a1',b: 'b1'
export function printProcessFlowChart(url, param, printType) {
  // FR.showDialog("Test", 600, 400, "Hello World");
  var printurl = "http://10.10.0.4:8070/fr/decision/view/report";
  var reportlets = "[{reportlet: '" + url + "', " + param + "}]";
  var config = {
    printUrl: printurl,
    isPopUp: false, // 是否弹出设置窗口，true为弹出，false为不弹出
    data: {
      // 多模板格式： [{reportlet: 'name.cpt', a: 'a1'}, {reportlet: 'name.cpt', b: 'b1'}]  同样的模板会出现多页
      // 单模板格式： [{reportlet: 'name.cpt', a: 'a1', b: 'b1'}]  同样的模板只会有单页
      reportlets: reportlets // 需要打印的模板列表
    },
    printType: printType === 1 ? 1 : 0, // 打印类型，0为零客户端打印，1为本地打印
    // 以下为零客户端打印的参数，仅当 printType 为 0 时生效
    ieQuietPrint: false,// IE静默打印设置 true为静默，false为不静默
    // 以下为本地打印的参数，仅当 printType 为 1 时生效
    // printerName: 'Microsoft Print to PDF', // 打印机名
    pageType: 0, // 打印页码类型：0：所有页，1：当前页，2：指定页
    pageIndex: '1-3', // 页码范围。当 pageType 为 2 时有效
    // copy: 3, // 打印份数
  };
  FR.doURLPrint(config)
}
