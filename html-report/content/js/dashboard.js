/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 23.80952380952381, "KoPercent": 76.19047619047619};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04692307692307692, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Update Admin User"], "isController": false}, {"data": [0.0, 500, 1500, "Directory List"], "isController": false}, {"data": [0.0, 500, 1500, "Login Validate"], "isController": false}, {"data": [0.0, 500, 1500, "Add Candidates"], "isController": false}, {"data": [0.0, 500, 1500, "PIM Employees"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Employee"], "isController": false}, {"data": [0.0, 500, 1500, "Leave"], "isController": true}, {"data": [0.0, 500, 1500, "Punch in List"], "isController": false}, {"data": [0.0, 500, 1500, "Recruitment"], "isController": true}, {"data": [0.0, 500, 1500, "Submit Timesheet"], "isController": false}, {"data": [0.0, 500, 1500, "Add Expenses in claim id "], "isController": false}, {"data": [0.0, 500, 1500, "Employment Status"], "isController": false}, {"data": [0.0, 500, 1500, "Vacancies List"], "isController": false}, {"data": [0.0, 500, 1500, "Submit claim"], "isController": false}, {"data": [0.0, 500, 1500, "Punch Time"], "isController": true}, {"data": [0.0, 500, 1500, "Admin Users"], "isController": false}, {"data": [0.0, 500, 1500, "Forgot Password Form"], "isController": false}, {"data": [0.0, 500, 1500, "Candidate Shortlist"], "isController": false}, {"data": [0.08, 500, 1500, "Login Validate-1"], "isController": false}, {"data": [0.4, 500, 1500, "Login Validate-0"], "isController": false}, {"data": [0.0, 500, 1500, "Directory"], "isController": true}, {"data": [0.0, 500, 1500, "Assign Leave"], "isController": false}, {"data": [0.0, 500, 1500, "Add Employee"], "isController": false}, {"data": [0.0, 500, 1500, "Forgot Password"], "isController": true}, {"data": [0.0, 500, 1500, "Schedule Interview"], "isController": false}, {"data": [0.48, 500, 1500, "Punch in List-1"], "isController": false}, {"data": [0.5, 500, 1500, "Punch in List-0"], "isController": false}, {"data": [0.0, 500, 1500, "Timesheet"], "isController": true}, {"data": [0.0, 500, 1500, "Job Titles"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Admin User"], "isController": false}, {"data": [0.0, 500, 1500, "Add Holiday"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.0, 500, 1500, "Create Timesheet"], "isController": false}, {"data": [0.0, 500, 1500, "Admin"], "isController": true}, {"data": [0.0, 500, 1500, "Claims List"], "isController": false}, {"data": [0.0, 500, 1500, "Punch out List"], "isController": false}, {"data": [0.0, 500, 1500, "Punch Out"], "isController": false}, {"data": [0.0, 500, 1500, "Add Admin User"], "isController": false}, {"data": [0.0, 500, 1500, "PIM"], "isController": true}, {"data": [0.0, 500, 1500, "Search Employee in Directory"], "isController": false}, {"data": [0.48, 500, 1500, "Punch out List-1"], "isController": false}, {"data": [0.5, 500, 1500, "Punch out List-0"], "isController": false}, {"data": [0.0, 500, 1500, "Punch In"], "isController": false}, {"data": [0.0, 500, 1500, "Candidates List"], "isController": false}, {"data": [0.0, 500, 1500, "Candidate Reject"], "isController": false}, {"data": [0.0, 500, 1500, "PIM Employees List Limit"], "isController": false}, {"data": [0.0, 500, 1500, "Claim Request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 1600, 76.19047619047619, 1281.4142857142845, 336, 4179, 1095.0, 2213.7000000000003, 2520.7999999999993, 3788.9799999999996, 44.642857142857146, 43.541234853316325, 43.13445837319303], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Update Admin User", 50, 50, 100.0, 929.1400000000001, 738, 1236, 889.5, 1112.7, 1213.1999999999998, 1236.0, 17.452006980802793, 6.714932373472949, 16.361256544502616], "isController": false}, {"data": ["Directory List", 50, 50, 100.0, 1087.28, 937, 1330, 1069.0, 1204.7, 1276.5499999999997, 1330.0, 11.361054305839582, 4.371343160645308, 9.064434929561465], "isController": false}, {"data": ["Login Validate", 50, 0, 0.0, 3504.239999999999, 2482, 4089, 3709.0, 3864.5, 3981.45, 4089.0, 9.446438692612885, 42.26506411770262, 16.65119320328736], "isController": false}, {"data": ["Add Candidates", 50, 50, 100.0, 1185.0999999999997, 978, 1324, 1216.5, 1285.8, 1298.1499999999999, 1324.0, 11.848341232227487, 4.55883441943128, 29.503295319905217], "isController": false}, {"data": ["PIM Employees", 50, 50, 100.0, 1543.0600000000002, 656, 2361, 1387.0, 2269.2999999999997, 2313.35, 2361.0, 14.556040756914118, 5.600664119359534, 11.272402656477437], "isController": false}, {"data": ["Delete Employee", 50, 50, 100.0, 1089.5200000000002, 903, 1305, 1087.0, 1236.2, 1253.1499999999999, 1305.0, 16.789791806581597, 6.4601347380792475, 14.838634360308932], "isController": false}, {"data": ["Leave", 50, 50, 100.0, 2381.56, 1821, 2670, 2401.5, 2526.3, 2559.25, 2670.0, 10.524100189433803, 8.098623973900231, 19.948514128604504], "isController": true}, {"data": ["Punch in List", 50, 0, 0.0, 2223.2999999999997, 1759, 2532, 2241.5, 2498.4, 2514.8, 2532.0, 8.47314014573801, 37.904559343755295, 13.024143153702763], "isController": false}, {"data": ["Recruitment", 50, 50, 100.0, 6683.660000000001, 5770, 7054, 6673.5, 6857.1, 7034.599999999999, 7054.0, 5.450779461462989, 11.737274133326066, 38.37817167229914], "isController": true}, {"data": ["Submit Timesheet", 50, 50, 100.0, 896.0999999999997, 364, 1319, 901.0, 1131.7, 1217.8499999999995, 1319.0, 13.078733978550876, 4.355320592466649, 11.405575627779232], "isController": false}, {"data": ["Add Expenses in claim id ", 250, 250, 100.0, 1036.156, 373, 1529, 1029.0, 1126.9, 1177.7999999999997, 1394.3800000000006, 28.239015023155993, 9.403812620015815, 26.418922257991643], "isController": false}, {"data": ["Employment Status", 50, 50, 100.0, 1112.3200000000004, 978, 1408, 1090.5, 1218.5, 1231.3, 1408.0, 15.47508511296812, 5.954280795419375, 12.286371285979573], "isController": false}, {"data": ["Vacancies List", 50, 50, 100.0, 1090.7600000000002, 957, 1324, 1082.0, 1173.3, 1284.9499999999998, 1324.0, 11.933174224343675, 4.591475238663484, 10.150190184964199], "isController": false}, {"data": ["Submit claim", 50, 50, 100.0, 1213.9800000000002, 350, 1475, 1260.0, 1427.3, 1450.6, 1475.0, 10.40582726326743, 3.4652217741935485, 9.12542273673257], "isController": false}, {"data": ["Punch Time", 50, 50, 100.0, 6648.480000000001, 6097, 6871, 6659.5, 6816.7, 6848.15, 6871.0, 4.73798919738463, 46.02789935326447, 23.449344972993458], "isController": true}, {"data": ["Admin Users", 50, 50, 100.0, 890.7199999999999, 758, 1092, 905.0, 968.5, 997.8999999999999, 1092.0, 18.32172957127153, 7.049571729571271, 15.101113045071454], "isController": false}, {"data": ["Forgot Password Form", 50, 0, 0.0, 3250.0000000000005, 2211, 4179, 3225.5, 3865.4, 4011.549999999999, 4179.0, 11.488970588235295, 26.77019904641544, 10.389440199908087], "isController": false}, {"data": ["Candidate Shortlist", 50, 50, 100.0, 1039.78, 916, 1265, 1017.5, 1156.9, 1227.25, 1265.0, 11.756407241946862, 3.914975458499882, 10.665724929461556], "isController": false}, {"data": ["Login Validate-1", 50, 0, 0.0, 2086.64, 1111, 2631, 2329.5, 2491.9, 2558.7, 2631.0, 13.408420488066506, 34.07833869670153, 10.252727775543041], "isController": false}, {"data": ["Login Validate-0", 50, 0, 0.0, 1416.6200000000006, 1237, 1610, 1379.5, 1571.1, 1605.8, 1610.0, 17.1291538198013, 33.104097079479274, 17.095698441247002], "isController": false}, {"data": ["Directory", 50, 50, 100.0, 2113.24, 1910, 2504, 2109.5, 2234.7, 2348.1499999999996, 2504.0, 8.976660682226212, 6.907820915619389, 14.297786692100537], "isController": true}, {"data": ["Assign Leave", 50, 50, 100.0, 1172.0199999999995, 458, 1546, 1183.0, 1317.6, 1327.1499999999999, 1546.0, 13.437248051599033, 5.170191144853534, 13.253535675893577], "isController": false}, {"data": ["Add Employee", 50, 50, 100.0, 1101.0800000000002, 764, 1386, 1059.5, 1293.3, 1353.0499999999997, 1386.0, 15.441630636195184, 5.941408662754787, 14.401130134342187], "isController": false}, {"data": ["Forgot Password", 50, 0, 0.0, 3250.0000000000005, 2211, 4179, 3225.5, 3865.4, 4011.549999999999, 4179.0, 10.699764605178686, 24.931287449176118, 9.675763695698695], "isController": true}, {"data": ["Schedule Interview", 50, 50, 100.0, 1119.66, 955, 1399, 1056.5, 1343.7, 1373.85, 1399.0, 11.51808339092375, 3.8356117542041, 11.83303098364432], "isController": false}, {"data": ["Punch in List-1", 50, 0, 0.0, 1213.0599999999995, 867, 1569, 1244.0, 1458.6999999999998, 1500.6499999999999, 1569.0, 9.869719699960521, 25.077762596229768, 7.546865747137781], "isController": false}, {"data": ["Punch in List-0", 50, 0, 0.0, 1009.74, 793, 1486, 993.5, 1261.8999999999999, 1309.1499999999999, 1486.0, 10.52853232259423, 20.347622525794904, 8.132879948410192], "isController": false}, {"data": ["Timesheet", 50, 50, 100.0, 1986.479999999999, 1125, 2336, 2029.0, 2291.8, 2327.95, 2336.0, 10.32844453625284, 7.4134831388142945, 18.034432451972734], "isController": true}, {"data": ["Job Titles", 50, 50, 100.0, 1004.8800000000005, 833, 1250, 1001.5, 1139.8, 1226.5499999999997, 1250.0, 15.688735487919672, 6.036486115469094, 12.318108722936932], "isController": false}, {"data": ["Delete Admin User", 50, 50, 100.0, 1131.56, 859, 1333, 1130.5, 1236.3, 1292.9, 1333.0, 14.762326542663123, 5.680035798641866, 12.96028472837319], "isController": false}, {"data": ["Add Holiday", 50, 50, 100.0, 1209.5399999999997, 935, 1578, 1223.5, 1423.2, 1468.6, 1578.0, 14.128284826222098, 5.436078341339361, 12.845149583215598], "isController": false}, {"data": ["Login", 50, 0, 0.0, 3504.239999999999, 2482, 4089, 3709.0, 3864.5, 3981.45, 4089.0, 9.444654325651682, 42.25708053928977, 16.64804790800907], "isController": true}, {"data": ["Create Timesheet", 50, 50, 100.0, 1090.38, 761, 1305, 1134.0, 1261.3, 1294.35, 1305.0, 11.170688114387847, 4.298096794012511, 9.763443224977658], "isController": false}, {"data": ["Admin", 50, 50, 100.0, 3754.7199999999993, 2882, 4174, 3735.5, 3983.7999999999997, 4147.4, 4174.0, 8.165931732810714, 12.567879307528989, 29.0672081700147], "isController": true}, {"data": ["Claims List", 50, 50, 100.0, 1023.56, 338, 1239, 1025.0, 1162.8, 1226.1999999999998, 1239.0, 12.065637065637066, 4.642442386583012, 9.473410352316602], "isController": false}, {"data": ["Punch out List", 50, 0, 0.0, 2371.1800000000003, 1558, 2523, 2385.0, 2486.7, 2509.45, 2523.0, 8.045052292839904, 35.97442553298472, 12.373981798069188], "isController": false}, {"data": ["Punch Out", 50, 50, 100.0, 956.3999999999999, 788, 1438, 930.0, 1048.8, 1316.2499999999995, 1438.0, 10.092854259184497, 3.8833833770690354, 9.462050867985466], "isController": false}, {"data": ["Add Admin User", 50, 50, 100.0, 803.3, 337, 927, 807.0, 891.8, 909.05, 927.0, 19.723865877712033, 7.589065581854043, 18.144415680473372], "isController": false}, {"data": ["PIM", 50, 50, 100.0, 6943.96, 6132, 7789, 6788.0, 7636.9, 7747.1, 7789.0, 5.460899956312801, 12.606999508519003, 27.56047946701616], "isController": true}, {"data": ["Search Employee in Directory", 50, 50, 100.0, 1025.9599999999998, 925, 1209, 1007.5, 1138.8, 1171.25, 1209.0, 11.79245283018868, 4.537330483490566, 9.374078714622641], "isController": false}, {"data": ["Punch out List-1", 50, 0, 0.0, 1185.6799999999994, 929, 1573, 1181.0, 1340.2, 1425.6999999999994, 1573.0, 9.576709442635511, 24.315302683872822, 7.3228159117027385], "isController": false}, {"data": ["Punch out List-0", 50, 0, 0.0, 1185.0400000000002, 336, 1502, 1198.5, 1377.5, 1481.3, 1502.0, 9.460737937559129, 18.283984744560076, 7.317289498580889], "isController": false}, {"data": ["Punch In", 50, 50, 100.0, 1097.6, 819, 1510, 1092.0, 1399.0, 1425.7, 1510.0, 10.451505016722408, 4.021379859949833, 9.788079405309364], "isController": false}, {"data": ["Candidates List", 50, 50, 100.0, 985.1400000000003, 520, 1245, 976.0, 1089.1, 1128.25, 1245.0, 14.496955639315743, 5.577930197158597, 12.514949985503044], "isController": false}, {"data": ["Candidate Reject", 50, 50, 100.0, 1263.1999999999996, 976, 1445, 1305.5, 1402.7, 1422.3999999999999, 1445.0, 11.930326890956811, 3.972892060367454, 10.765255905511811], "isController": false}, {"data": ["PIM Employees List Limit", 50, 50, 100.0, 1093.1000000000001, 943, 1530, 1062.0, 1288.3, 1321.75, 1530.0, 14.85001485001485, 5.7137752450252455, 13.02276692901693], "isController": false}, {"data": ["Claim Request", 100, 100, 100.0, 4747.140000000001, 899, 9312, 4161.5, 8735.1, 8850.85, 9307.849999999999, 8.489685032685287, 13.381202776127006, 34.59712464980049], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 1100, 68.75, 52.38095238095238], "isController": false}, {"data": ["404/Not Found", 500, 31.25, 23.80952380952381], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 1600, "401/Unauthorized", 1100, "404/Not Found", 500, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Update Admin User", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Directory List", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Add Candidates", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PIM Employees", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Employee", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit Timesheet", 50, 50, "404/Not Found", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add Expenses in claim id ", 250, 250, "404/Not Found", 250, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Employment Status", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Vacancies List", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Submit claim", 50, 50, "404/Not Found", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin Users", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Candidate Shortlist", 50, 50, "404/Not Found", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Assign Leave", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add Employee", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Schedule Interview", 50, 50, "404/Not Found", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Job Titles", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Admin User", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add Holiday", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Timesheet", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Claims List", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Punch Out", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add Admin User", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Search Employee in Directory", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Punch In", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Candidates List", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Candidate Reject", 50, 50, "404/Not Found", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PIM Employees List Limit", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Claim Request", 50, 50, "401/Unauthorized", 50, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
