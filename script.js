document.addEventListener('DOMContentLoaded', function() {
    const barChartElement = document.getElementById('barChart').getContext('2d');
    const pieChartElement = document.getElementById('pieChart').getContext('2d');
    const lineChartElement = document.getElementById('lineChart').getContext('2d');
    const scatterChartElement = document.getElementById('scatterChart').getContext('2d');
    const doughnutChartElement = document.getElementById('doughnutChart').getContext('2d');

    let barChart, pieChart, lineChart, scatterChart, doughnutChart;

    function updateFilterOptions(data) {
        // Get all unique column names (excluding the first for potential ID column)
        const columnNames = Object.keys(data[0]).slice(1); // Assuming first column might be ID
      
        const filterSelect = document.getElementById('filter');
        filterSelect.innerHTML = '<option value="All">All</option>';
      
        columnNames.forEach(columnName => {
          const option = document.createElement('option');
          option.value = columnName;
          option.text = columnName;
          filterSelect.add(option);
        });
      
        window.currentData = data;
      }

    function parseCSVFile(fileInput, callback) {
        const file = fileInput.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: function(results) {
                    callback(results.data);
                }
            });
        }
    }

    function updateCharts(data, filter) {
        const filteredData = filter === 'All' ? data : data.filter(row => row['Leading Party'] === filter);

        const labels = filteredData.map(row => row['Constituency']);
        const votes = filteredData.map(row => +row['Margin']);

        const partyVotes = filteredData.reduce((acc, row) => {
            acc[row['Leading Party']] = (acc[row['Leading Party']] || 0) + +row['Margin'];
            return acc;
        }, {});

        const lineData = filteredData.map(row => ({
            x: row['Constituency'],
            y: +row['Margin']
        }));

        const scatterData = filteredData.map(row => ({
            x: row['Leading Party'],
            y: +row['Margin']
        }));

        const barData = {
            labels,
            datasets: [{
                label: 'Votes Margin',
                data: votes,
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        };

        const pieData = {
            labels: Object.keys(partyVotes),
            datasets: [{
                data: Object.values(partyVotes),
                backgroundColor: Object.keys(partyVotes).map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`)
            }]
        };

        const lineChartData = {
            datasets: [{
                label: 'Votes Margin Over Constituencies',
                data: lineData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0.1
            }]
        };

        const scatterChartData = {
            datasets: [{
                label: 'Votes Margin Scatter',
                data: scatterData,
                backgroundColor: 'rgba(153, 102, 255, 0.6)'
            }]
        };

        const doughnutData = {
            labels: Object.keys(partyVotes),
            datasets: [{
                data: Object.values(partyVotes),
                backgroundColor: Object.keys(partyVotes).map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`)
            }]
        };

        if (barChart) barChart.destroy();
        if (pieChart) pieChart.destroy();
        if (lineChart) lineChart.destroy();
        if (scatterChart) scatterChart.destroy();
        if (doughnutChart) doughnutChart.destroy();

        barChart = new Chart(barChartElement, {
            type: 'bar',
            data: barData
        });

        pieChart = new Chart(pieChartElement, {
            type: 'pie',
            data: pieData
        });

        lineChart = new Chart(lineChartElement, {
            type: 'line',
            data: lineChartData
        });

        scatterChart = new Chart(scatterChartElement, {
            type: 'scatter',
            data: scatterChartData
        });

        doughnutChart = new Chart(doughnutChartElement, {
            type: 'doughnut',
            data: doughnutData
        });
    }

    document.getElementById('file1').addEventListener('change', function() {
        parseCSVFile(this, function(data) {
            updateCharts(data, 'All');
            updateFilterOptions(data);
        });
    });

    document.getElementById('file2').addEventListener('change', function() {
        parseCSVFile(this, function(data) {
            updateCharts(data, 'All');
            updateFilterOptions(data);
        });
    });

    document.getElementById('filter').addEventListener('change', function() {
        const filterValue = this.value;
        const data = window.currentData || [];
        updateCharts(data, filterValue);
    });

    function updateFilterOptions(data) {
        const parties = Array.from(new Set(data.map(row => row['Leading Party'])));
        const filterSelect = document.getElementById('filter');
        filterSelect.innerHTML = '<option value="All">All</option>';

        parties.forEach(party => {
            const option = document.createElement('option');
            option.value = party;
            option.text = party;
            filterSelect.add(option);
        });

        window.currentData = data;
    }
});
