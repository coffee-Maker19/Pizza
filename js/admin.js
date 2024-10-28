$(document).ready(function(){
    $('.nav-link').on('click', function(e){
        e.preventDefault()
        $('.nav-link').removeClass('link-active')
        $(this).addClass('link-active')
        
        let url = $(this).attr('href')
        window.history.pushState({path: url}, '', url)
    })

    $('#dashboard-link').on('click', function(e){
        e.preventDefault()
        viewAnalytics()
    })

    $('#products-link').on('click', function(e){
        e.preventDefault()
        viewProducts()
    })

    $('#account-link').on('click', function(e){
        e.preventDefault()
        viewAccount()
    })


    let url = window.location.href;
    if (url.endsWith('dashboard')){
        $('#dashboard-link').trigger('click')
    }else if (url.endsWith('products')){
        $('#products-link').trigger('click')
    }else{
        $('#dashboard-link').trigger('click')
    }

    function viewAnalytics(){
        $.ajax({
            type: 'GET',
            url: 'view-analytics.php',
            dataType: 'html',
            success: function(response){
                $('.content-page').html(response)
                loadChart()
            }
        })
    }

    function loadChart(){
        const ctx = document.getElementById('salesChart').getContext('2d');
        const salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            datasets: [{
            label: 'Sales',
            data: [7000, 5500, 5000, 4000, 4500, 6500, 8200, 8500, 9200, 9600, 10000, 9800],
            backgroundColor: '#EE4C51',
            borderColor: '#EE4C51',
            borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
            y: {
                beginAtZero: true,
                max: 10000,
                ticks: {
                    stepSize: 2000
                }
            }
            }
        }
        });
    }

    function viewProducts(){
        $.ajax({
            type: 'GET',
            url: '../products/view-products.php',
            dataType: 'html',
            success: function(response){
                $('.content-page').html(response)

                var table = $('#table-products').DataTable({
                    dom: 'rtp',
                    pageLength: 10,
                    ordering: false,
                });

                $('#custom-search').on('keyup', function() {
                    table.search(this.value).draw()
                });

                $('#category-filter').on('change', function() {
                    if(this.value !== 'choose'){
                        table.column(3).search(this.value).draw()
                    }
                });

                $('#add-product').on('click', function(e){
                    e.preventDefault()
                    addProduct()
                })

            }
        })
    }

    function addProduct(){
        $.ajax({
            type: 'GET',
            url: '../products/add-product.html',
            dataType: 'html',
            success: function(view){
                $('.modal-container').html(view)
                $('#modal-add-product').modal('show')

                fetchCategories()

                $('#form-add-product').on('submit', function(e){
                    e.preventDefault()
                    saveProduct()
                })
            }
        })
    }

    function saveProduct(){
        let form = new FormData($('#form-add-product')[0])
        $.ajax({
            type: 'POST',
            url: '../products/add-product.php',
            data: form,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status === 'error') {
                    if (response.codeErr) {
                        $('#code').addClass('is-invalid');
                        $('#code').next('.invalid-feedback').text(response.codeErr).show();
                    }else{
                        $('#code').removeClass('is-invalid');
                    }
                    if (response.nameErr) {
                        $('#name').addClass('is-invalid');
                        $('#name').next('.invalid-feedback').text(response.nameErr).show();
                    }else{
                        $('#name').removeClass('is-invalid');
                    }
                    if (response.categoryErr) {
                        $('#category').addClass('is-invalid');
                        $('#category').next('.invalid-feedback').text(response.categoryErr).show();
                    }else{
                        $('#category').removeClass('is-invalid');
                    }
                    if (response.priceErr) {
                        $('#price').addClass('is-invalid');
                        $('#price').next('.invalid-feedback').text(response.priceErr).show();
                    }else{
                        $('#price').removeClass('is-invalid');
                    }
                    if (response.imageErr) {
                        $('#product_image').addClass('is-invalid');
                        $('#product_image').next('.invalid-feedback').text(response.imageErr).show();
                    }else{
                        $('#product_image').removeClass('is-invalid');
                    }
                } else if (response.status === 'success') {
                    $('#modal-add-product').modal('hide');
                    $('#form-add-product')[0].reset();
                    viewProducts()
                }
            }
        });
        
    }

    function fetchCategories(){
        $.ajax({
            url: '../products/fetch-categories.php', // URL to the PHP script that returns the categories
            type: 'GET',
            dataType: 'json', // Expect JSON response
            success: function(data) {
                // Clear the existing options (if any) and add a default "Select" option
                $('#category').empty().append('<option value="">--Select--</option>');
                
                // Iterate through the data (categories) and append each one to the select dropdown
                $.each(data, function(index, category) {
                    $('#category').append(
                        $('<option>', {
                            value: category.id, // The value attribute
                            text: category.name // The displayed text
                        })
                    );
                });
            }
        });
    }

    function viewAccount(){
        $.ajax({
            type: 'GET',
            url: '../account/view-account.php',
            dataType: 'html',
            success: function(response){
                $('.content-page').html(response)

                var table = $('#table-account').DataTable({
                    dom: 'rtp',
                    pageLength: 10,
                    ordering: false
                })

                  // Bind custom input to DataTable search
                  $('#custom-search').on('keyup', function() {
                    table.search(this.value).draw()
                });

                $('#role-filter').on('change', function() {
                    if(this.value !== 'choose'){
                        table.column(3).search(this.value).draw()
                    }
                });

                $('#add-account').on('click', function(e){
                    e.preventDefault()
                    addAccount()
                });
            }
        })
    }


    function addAccount(){
        $.ajax({
            type: 'GET',
            url: '../account/add-account.html',
            dataType: 'html',
            success: function(view){
                $('.modal-container').html(view)
                $('#modal-add-account').modal('show')

                fetch_role()

                $('#form-add-account').on('submit', function(e){
                    e.preventDefault()
                    saveAccount()
                })
            }
        })
    }
    

    function fetch_role(){
        $.ajax({
            url: '../account/fetch-role.php', // URL to the PHP script that returns the role
            type: 'GET',
            dataType: 'json', // Expect JSON response
            success: function(data) {
                // Clear the existing options (if any) and add a default "Select" option
                $('#role').empty().append('<option value="">--Select--</option>');
                
                // Iterate through the data (categories) and append each one to the select dropdown
                $.each(data, function(index, role) {
                    $('#role').append(
                        $('<option>', {
                            value: role.role, // The value attribute
                            text: role.role // The displayed text
                        })
                    );
                });
            }
        });
    }

    function saveAccount() {
        $.ajax({
            type: 'POST',
            url: '../account/add-account.php',
            data: $('form').serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.status === 'error') {
                    // First name validation
                    if (response.first_nameErr) { 
                        $('#first_name').addClass('is-invalid');
                        $('#first_name').next('.invalid-feedback').text(response.first_nameErr).show();
                    } else {
                        $('#first_name').removeClass('is-invalid');
                    }
    
                    // Last name validation
                    if (response.last_nameErr) {
                        $('#last_name').addClass('is-invalid');
                        $('#last_name').next('.invalid-feedback').text(response.last_nameErr).show();
                    } else {
                        $('#last_name').removeClass('is-invalid');
                    }
    
                    // Username validation
                    if (response.usernameErr) {
                        $('#username').addClass('is-invalid');
                        $('#username').next('.invalid-feedback').text(response.usernameErr).show();
                    } else {
                        $('#username').removeClass('is-invalid');
                    }
    
                    // Password validation
                    if (response.passwordErr) {
                        $('#password').addClass('is-invalid');
                        $('#password').next('.invalid-feedback').text(response.passwordErr).show();
                    } else {
                        $('#password').removeClass('is-invalid');
                    }
                    
                    if (response.confirmpasswordErr) {
                        $('#confirmpassword').addClass('is-invalid');
                        $('#confirmpassword').next('.invalid-feedback').text(response.confirmpasswordErr).show();
                    } else {
                        $('#confirmpassword').removeClass('is-invalid');
                    }

                    if (response.roleErr) {
                        $('#role').addClass('is-invalid');
                        $('#role').next('.invalid-feedback').text(response.roleErr).show();
                    } else {
                        $('#role').removeClass('is-invalid');
                    }
                    
                } else if (response.status === 'success') {
                    // Close modal and reset form on success
                    $('#modal-add-account').modal('hide');
                    $('#form-add-account')[0].reset();
                    viewAccount();
                }
            }
        });
    }
    
});