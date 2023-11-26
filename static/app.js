let cupcakeList = $('#cupcake-list');
let flavorField = $('#flavor');
let sizeField = $('#size');
let ratingField = $('#rating');
let imageField = $('#image');


function getCupcakes() {
    $.get('/api/cupcakes', function (response) {
        fillCupcakeList(response.cupcakes);
    });
}

function fillCupcakeList(cupcakes) {
    cupcakeList.empty();
    if (cupcakes.length === 0) {
        cupcakeList.append('<h3>No cupcakes yet!</h3>');
    }
    for (let cupcake of cupcakes) {
        if (!cupcake.image) {
            cupcake.image = 'https://tinyurl.com/demo-cupcake';
        }
        cupcakeList.append(`
        <li data-cupcake-id = "${cupcake.id}">
            <img src="${cupcake.image}" alt="Cupcake Image">
            <span>${cupcake.flavor}, ${cupcake.size}, rating: ${cupcake.rating}/10</span>
            <button id="delete-btn" class="btn btn-danger">Delete</button>
        </li>
        `);
    }
}


function ValidateForm(flavor, size, rating, image) {
    let isValid = true;
    if (flavor === '') {
        isValid = false;
        flavorField.val('');
        flavorField.attr('placeholder', 'Please enter a flavor');
    }
    if (size === '') {
        isValid = false;
        sizeField.val('');
        sizeField.attr('placeholder', 'Please enter a size');
    }
    if (isValid) {
        flavorField.val('');
        sizeField.val('');
        ratingField.val('');
        imageField.val('');
    }
    return isValid
}

$('#cupcake-form').on('submit', function (evt) {
    evt.preventDefault();

    let flavor = flavorField.val().trim();
    let size = sizeField.val().trim();
    let rating = ratingField.val();
    let image = imageField.val().trim();

    if (ValidateForm(flavor, size, rating, image)) {
        axios.post('/api/cupcakes', { flavor, size, rating, image })
            .then(function (response) {
                getCupcakes();
            })
    }
});

cupcakeList.on('click', '#delete-btn', function (evt) {
    evt.preventDefault();
    let cupcakeId = $(evt.target).closest('li').attr('data-cupcake-id');
    axios.delete('/api/cupcakes/' + cupcakeId) //
        .then(function (response) {
            getCupcakes();
        })
});

getCupcakes();