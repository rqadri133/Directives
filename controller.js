'use strict';
app.controller('ServerTimeController', ['$scope', 'backendHubProxy',
    function ServerTimeController($scope, backendHubProxy) {
        var clientPushHubProxy = backendHubProxy(backendHubProxy.defaultServer, 'performanceHub', { logging: true });
        var serverTimeHubProxy = backendHubProxy(backendHubProxy.defaultServer, 'performanceHub');

        clientPushHubProxy.on('serverTime', function (data) {
            $scope.currentServerTime = data;
            var x = clientPushHubProxy.connection.id;
        });

        $scope.getServerTime = function () {
            serverTimeHubProxy.invoke('getServerTime', function (data) {
                $scope.currentServerTimeManually = data;
            });
        };
    }
]);


app.controller('PerformanceDataController', ['$scope', 'backendHubProxy'  , 'tmHubProxy',
    function ($scope, backendHubProxy ,tmHubProxy) {
        var performanceDataHub = backendHubProxy(backendHubProxy.defaultServer, 'performanceHub');
        var tmDataHub = tmHubProxy(tmHubProxy.defaultServer, 'randomNumberHub');
        var entry = [];

        $scope.currentRamNumber = 0;
        $scope.realtimeLine = generateLineData();
        $scope.realtimeBar = generateLineData();
        $scope.realtimeArea = generateLineData();
        $scope.options = { thickness: 10, mode: 'gauge', total: 100 };
        $scope.data = [
            { label: 'CPU', value: 78, color: '#d62728', suffix: '%' }
        ];

        $scope.ramGaugeoptions = { thickness: 10, mode: 'gauge', total: 100 };
        $scope.ramGaugeData = [
            { label: 'RAM', value: 68, color: '#1f77b4', suffix: '%' }
        ];
        $scope.currentRamNumber = 68;
        //$scope.realtimeLineFeed = entry;
        $scope.donutData = [23, 24, 25, 33];

        var _text = "Name,Population (mill),Average Life Expectancy,Area (1000 sq mi),Continent"
        _text = _text + "\n" + "  Canada,33.9,80.7,3854.085,America"
        _text = _text + "\n" + "US,308.3,78.2,3784.191,America"
        _text = _text + "\n" + "Germany,82.3,79.4,137.847,Europe"
        _text = _text + "\n" + "Russia,141.9,65.5,6601.668,Europe"
        _text = _text + "\n" + "Mexico,108.4,76.06,758.449,America"
        _text = _text + "\n" + "Brazil,193.3,71.99,3287.612,America"
        _text = _text + "\n" + "Spain,46.9,80.9,195.365,Europe"
        _text = _text + "\n" + "France,65.4,80.98,244.339,Europe"
        _text = _text + "\n" + "China,1339,73,3705.407,Asia"
        _text = _text + "\n" + "Australia,22.4,81.2,2969.907,Australia"
        _text = _text + "\n" + "UK,62,79.4,93.800,Europe"
        _text = _text + "\n" + "Italy,60.3,80.5,116.346,Europe"
        _text = _text + "\n" + "India,1184,64.7,1236.085,Asia"
        _text = _text + "\n" + "Japan,127.4,82.6,145.920,Asia"
        _text = _text + "\n" + "Iceland,0.3,81.8,40.000,Europe"
        _text = _text + "\n" + "Portugal,10.6,78.1,35.560,Europe"
        _text = _text + "\n" + "South Africa,50,49.3,471.445,Africa"
        _text = _text + "\n" + "Egypt,78.9,71.3,387.000,Africa"
        _text = _text + "\n" + "Sweden,9.3,80.9,170.410,Europe"


        $scope.barData = _text;

        performanceDataHub.on('broadcastPerformance', function (data) {


            var timestamp = ((new Date()).getTime() / 1000) | 0;
            var chartEntry = [];
            data.forEach(function (dataItem) {

                switch(dataItem.categoryName) {
                    case 'Processor':
                        $scope.cpuData = dataItem.value;
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        $scope.data = [
                            { label: 'CPU', value: dataItem.value, color: '#d62728', suffix: '%' }
                        ];
                        break;
                    case 'Memory':
                        $scope.memData = dataItem.value;
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        $scope.ramGaugeData = [
                            { label: 'RAM', value: dataItem.value, color: '#1f77b4', suffix: '%' }
                        ];
                        $scope.currentRamNumber = dataItem.value;
                        break;
                    case 'Network In':
                        $scope.netInData = dataItem.value.toFixed(2);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;
                    case 'Network Out':
                        $scope.netOutData = dataItem.value.toFixed(2);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;
                    case 'Disk Read Bytes/Sec':
                        $scope.diskReaddData = dataItem.value.toFixed(3);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;
                    case 'Disk Write Bytes/Sec':
                        $scope.diskWriteData = dataItem.value.toFixed(3);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;


                    default:
                        break;
                    //default code block
                }
            });
            $scope.realtimeLineFeed = chartEntry;
            $scope.realtimeBarFeed = chartEntry;
            $scope.realtimeAreaFeed = chartEntry;
       
        });

        tmDataHub.on('broadcastRandomNumbers', function (data) {
            var timestamp = ((new Date()).getTime() / 1000) | 0;
            var chartEntry = [];
            /*
            Data BroadCast Failed need development effort to fix with other streaming going 
            on Signal R not receiving any messages from TMS Messenger Service to dashboard test failed

            12/1/2015 12:04 pm


            */


            data.forEach(function (dataItem) {

                if (dataItem.csvData != "") {
                    $scope.barData = dataItem.csvData;
                }
                $scope.donutData = [dataItem.numericData[0] / 10000000, dataItem.numericData[1] / 10000000, dataItem.numericData[2] / 10000000, dataItem.numericData[3] / 10000000]
            });
       
        });

           function generateLineData() {
            var data1 = [{ label: 'Layer 1', values: [] }];
            for (var i = 0; i <= 128; i++) {
                var x = 20 * (i / 128) - 10,
                    y = Math.cos(x) * x;
                data1[0].values.push({ x: x, y: y });
            }
            var data2 = [
                { label: 'Layer 1', values: [] },
                { label: 'Layer 2', values: [] },
                { label: 'Layer 3', values: [] }
            ];
            for (var i = 0; i < 256; i++) {
                var x = 40 * (i / 256) - 20;
                data2[0].values.push({ x: x, y: Math.sin(x) * (x / 4) });
                data2[1].values.push({ x: x, y: Math.cos(x) * (x / Math.PI) });
                data2[2].values.push({ x: x, y: Math.sin(x) * (x / 2) });
            }
            return data2;
        }

        $scope.areaAxes = ['left','right','bottom'];
        $scope.lineAxes = ['right','bottom'];
        $scope.scatterAxes = ['left','right','top','bottom'];
    }
]);
