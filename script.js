document.addEventListener('DOMContentLoaded', () => {
    const url = 'team22.json';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const team22 = data;

            function calculateMonthlySalesByCategory(data) {
                const monthlySales = {};

                data.forEach(order => {
                    const { category, quantity, date } = order;
                    const month = date.slice(0, 7);

                    if (!monthlySales[month]) {
                        monthlySales[month] = {};
                    }

                    if (monthlySales[month][category]) {
                        monthlySales[month][category] += parseInt(quantity);
                    } else {
                        monthlySales[month][category] = parseInt(quantity);
                    }
                });

                return monthlySales;
            }

            function calculateMonthlySalesByPizza(data) {
                const monthlySales = {};

                data.forEach(order => {
                    const { pizza_name, quantity, date } = order;
                    const month = date.slice(0, 7);

                    if (!monthlySales[month]) {
                        monthlySales[month] = {};
                    }

                    if (monthlySales[month][pizza_name]) {
                        monthlySales[month][pizza_name] += parseInt(quantity);
                    } else {
                        monthlySales[month][pizza_name] = parseInt(quantity);
                    }
                });

                return monthlySales;
            }

            function calculateMonthlySalesBySize(data) {
                const monthlySales = {};

                data.forEach(order => {
                    const { size, quantity, date } = order;
                    const month = date.slice(0, 7);

                    if (!monthlySales[month]) {
                        monthlySales[month] = {};
                    }

                    if (monthlySales[month][size]) {
                        monthlySales[month][size] += parseInt(quantity);
                    } else {
                        monthlySales[month][size] = parseInt(quantity);
                    }
                });

                return monthlySales;
            }

            function calculateMonthlyRevenue(data) {
                const monthlyRevenue = {};

                data.forEach(order => {
                    const { quantity, price, date } = order;
                    const month = date.slice(0, 7);
                    const revenue = quantity * price;

                    if (!monthlyRevenue[month]) {
                        monthlyRevenue[month] = 0;
                    }

                    monthlyRevenue[month] += revenue;
                });

                return monthlyRevenue;
            }

            function calculateMonthlyOrders(data) {
                const monthlyOrders = {};

                data.forEach(order => {
                    const { order_id, date } = order;
                    const month = date.slice(0, 7);

                    if (!monthlyOrders[month]) {
                        monthlyOrders[month] = new Set();
                    }

                    monthlyOrders[month].add(order_id);
                });

                const result = {};
                for (const [month, orders] of Object.entries(monthlyOrders)) {
                    result[month] = orders.size;
                }

                return result;
            }



            const monthlySalesByCategory = calculateMonthlySalesByCategory(team22);
            const monthlySalesByPizza = calculateMonthlySalesByPizza(team22);
            const monthlySalesBySize = calculateMonthlySalesBySize(team22);
            const monthlyRevenue = calculateMonthlyRevenue(team22);
            const monthlyOrders = calculateMonthlyOrders(team22);


            function calculateTotalRevenue(data) {
                const monthlyRevenue = calculateMonthlyRevenue(data);
                let totalRevenue = 0;
            
                for (const month in monthlyRevenue) {
                    totalRevenue += monthlyRevenue[month];
                }
            
                return Math.round(totalRevenue);
            }

            function calculateTotalOrders(data) {
                const monthlyOrders = calculateMonthlyOrders(data);
                let totalOrders = 0;
            
                for (const month in monthlyOrders) {
                    totalOrders += monthlyOrders[month];
                }
            
                return (totalOrders);
            }

            function calculateTotalRevenue(data) {
                const monthlyRevenue = calculateMonthlyRevenue(data);
                let totalRevenue = 0;
            
                for (const month in monthlyRevenue) {
                    totalRevenue += monthlyRevenue[month];
                }
            
                return Math.round(totalRevenue);
            }

            const totalRevenue = calculateTotalRevenue(data);
            const totalOrders = calculateTotalOrders(data);

            document.getElementById('total-revenue').innerText = totalRevenue;
            document.getElementById('total-orders').innerText = totalOrders;
            
            function getUniqueMonths(data) {
                const uniqueMonths = new Set();
                data.forEach(order => {
                    const month = order.date.slice(0, 7);
                    uniqueMonths.add(month);
                });
                return Array.from(uniqueMonths);
            }

            // Dapatkan bulan unik dari data
            let uniqueMonths = getUniqueMonths(team22);

            // Urutan bulan untuk pengurutan
            const monthOrder = [
                '01', '02', '03', '04', '05', '06',
                '07', '08', '09', '10', '11', '12'
            ];

            // Urutkan bulan sesuai urutan kalender
            uniqueMonths.sort((a, b) => {
                const [yearA, monthA] = a.split('-');
                const [yearB, monthB] = b.split('-');
                return yearA !== yearB ? yearA - yearB : monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
            });

            // Fungsi untuk mengonversi format YYYY-MM menjadi nama bulan
            function formatMonth(month) {
                const [year, monthNum] = month.split('-');
                const date = new Date(year, monthNum - 1);
                return date.toLocaleString('default', { month: 'long' });
            }

            const checkboxContainer = document.getElementById('checkboxContainer');

            uniqueMonths.forEach(month => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = month;
                checkbox.id = month;

                const label = document.createElement('label');
                label.htmlFor = month;
                label.textContent = formatMonth(month); // Menggunakan formatMonth untuk mengubah menjadi nama bulan

                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                checkboxContainer.appendChild(document.createElement('br')); // Tambahkan <br> untuk baris baru
            });

            const ctx1 = document.getElementById('salesChart1').getContext('2d');
            const ctx2 = document.getElementById('salesChart2').getContext('2d');
            const ctx3 = document.getElementById('salesChart3').getContext('2d');
            const ctx4 = document.getElementById('salesChart4').getContext('2d');
            const ctx5 = document.getElementById('salesChart5').getContext('2d');
            let salesChart1;
            let salesChart2;
            let salesChart3;
            let salesChart4;
            let salesChart5;

            function updateChart() {
                const selectedMonths = Array.from(document.querySelectorAll('.filter-container input:checked')).map(input => input.value);

                const filteredSalesByCategory = filterDataByMonths(monthlySalesByCategory, selectedMonths);
                const filteredSalesByPizza = filterDataByMonths(monthlySalesByPizza, selectedMonths);
                const filteredSalesBySize = filterDataByMonths(monthlySalesBySize, selectedMonths);

                const combinedSalesData1 = combineData(filteredSalesByCategory);
                const combinedSalesData2 = combineData(filteredSalesByPizza);
                const combinedSalesData3 = combineData(filteredSalesBySize);

                const labels1 = Object.keys(combinedSalesData1);
                const data1 = Object.values(combinedSalesData1);

                const labels2 = Object.keys(combinedSalesData2);
                const data2 = Object.values(combinedSalesData2);

                const labels3 = Object.keys(combinedSalesData3);
                const data3 = Object.values(combinedSalesData3);

                const labels4 = Object.keys(monthlyRevenue);
                const data4 = Object.values(monthlyRevenue);

                const labels5 = Object.keys(monthlyOrders);
                const data5 = Object.values(monthlyOrders);

                if (salesChart1) {
                    salesChart1.destroy();
                }

                if (salesChart2) {
                    salesChart2.destroy();
                }

                if (salesChart3) {
                    salesChart3.destroy();
                }

                if (salesChart4) {
                    salesChart4.destroy();
                }

                if (salesChart5) {
                    salesChart5.destroy();
                }

                salesChart1 = new Chart(ctx1, {
                    type: 'pie',
                    data: {
                        labels: labels1,
                        datasets: [{
                            label: 'Sales by Category',
                            data: data1,
                            backgroundColor: labels1.map((_, i) => `hsl(${i * 360 / labels1.length}, 70%, 50%)`)
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });

                salesChart2 = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: labels2,
                        datasets: [{
                            label: 'Sales by Pizza',
                            data: data2,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                salesChart3 = new Chart(ctx3, {
                    type: 'pie',
                    data: {
                        labels: labels3,
                        datasets: [{
                            label: 'Sales by Size',
                            data: data3,
                            backgroundColor: labels3.map((_, i) => `hsl(${i * 360 / labels3.length}, 70%, 50%)`)
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });

                salesChart4 = new Chart(ctx4, {
                    type: 'line',
                    data: {
                        labels: labels4,
                        datasets: [{
                            label: 'Monthly Revenue',
                            data: data4,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                salesChart5 = new Chart(ctx5, {
                    type: 'line',
                    data: {
                        labels: labels5,
                        datasets: [{
                            label: 'Monthly Orders',
                            data: data5,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            function filterDataByMonths(data, selectedMonths) {
                if (selectedMonths.length === 0) return data;

                const filteredData = {};
                selectedMonths.forEach(month => {
                    if (data[month]) {
                        filteredData[month] = data[month];
                    }
                });

                return filteredData;
            }

            function combineData(data) {
                const combinedData = {};

                Object.keys(data).forEach(month => {
                    Object.entries(data[month]).forEach(([key, value]) => {
                        if (!combinedData[key]) {
                            combinedData[key] = 0;
                        }
                        combinedData[key] += value;
                    });
                });

                return combinedData;
            }

            document.querySelectorAll('.filter-container input').forEach(input => {
                input.addEventListener('change', updateChart);
            });

            updateChart();
        })
        .catch(error => console.error('Error fetching the sales data:', error));
});


document.addEventListener("DOMContentLoaded", function() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("openModalBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // Check if elements are found
    if (!modal || !btn || !span) {
        console.error("Modal, button, or close element not found!");
        return;
    }

    // Variables for pagination
    let currentPage = 1;
    const rowsPerPage = 10;
    let jsonData = [];

    // Function to fetch and display JSON data
    function fetchAndDisplayData() {
        fetch('team22.json')
            .then(response => response.json())
            .then(data => {
                jsonData = data.slice(0, 100); // Limit to 100 rows
                displayTable(currentPage);
                setupPagination();
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    // Function to create table from JSON data
    function createTableFromJSON(data) {
        var table = document.createElement('table');
        table.style.width = '100%';
        table.setAttribute('border', '1');

        // Create table header
        var thead = table.createTHead();
        var row = thead.insertRow();
        for (var key in data[0]) {
            var th = document.createElement('th');
            var text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }

        // Create table body
        var tbody = table.createTBody();
        data.forEach(item => {
            var row = tbody.insertRow();
            for (var key in item) {
                var cell = row.insertCell();
                var text = document.createTextNode(item[key]);
                cell.appendChild(text);
            }
        });

        return table;
    }

    // Function to display table for the current page
    function displayTable(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = jsonData.slice(start, end);

        // Clear the existing table
        document.getElementById("modal-body").innerHTML = '';

        // Create and append the new table
        const table = createTableFromJSON(paginatedData);
        document.getElementById("modal-body").appendChild(table);
    }

    // Function to setup pagination controls
    function setupPagination() {
        const pageCount = Math.ceil(jsonData.length / rowsPerPage);
        const paginationControls = document.getElementById("pagination-controls");
        paginationControls.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.className = 'pagination-button';
            button.innerText = i;
            button.addEventListener('click', function() {
                currentPage = i;
                displayTable(currentPage);
            });
            paginationControls.appendChild(button);
        }
    }

    // When the user clicks the button, open the modal and fetch data
    btn.onclick = function() {
        console.log("Button clicked");
        modal.style.display = "block";
        console.log("Modal display set to block");
        fetchAndDisplayData();
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        console.log("Close button clicked");
        modal.style.display = "none";
        // Clear the modal body content
        document.getElementById("modal-body").innerHTML = '';
        document.getElementById("pagination-controls").innerHTML = '';
        currentPage = 1; // Reset to the first page
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            console.log("Outside click detected");
            modal.style.display = "none";
            // Clear the modal body content
            document.getElementById("modal-body").innerHTML = '';
            document.getElementById("pagination-controls").innerHTML = '';
            currentPage = 1; // Reset to the first page
        }
    }
});
