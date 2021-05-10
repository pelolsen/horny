function translate_height(height){
    let translation;
    if(height == '180'){
        translation = 'Over 180cm'
    } else if(height == "160180") {
        translation = 'Between 160cm and 180cm'
    } else if(height == '160'){
        translation = 'Under 160cm'
    } else {
        tranlation = 'Something went wrong. Please contact the Support Team'
    }
    return translation
}

module.exports.translate_height = translate_height;

function translate_gender(gender){
    let translation;
    if(gender == 'male'){
        translation = ' Male'
    } else if(gender == 'female'){
        translation = ' Female'
    } else {
        translation = ' Unknown. Please contact the Support Team'
    }
    return translation
}

module.exports.translate_gender = translate_gender;