module.exports = (template, obj) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, obj.productName);
    output = output.replace(/{%IMAGE%}/g, obj.image);
    output = output.replace(/{%PRICE%}/g, obj.price);
    output = output.replace(/{%FROM%}/g, obj.from);
    output = output.replace(/{%NUTRIENTS%}/g, obj.nutrients);
    output = output.replace(/{%QUANTITY%}/g, obj.quantity);
    output = output.replace(/{%ID%}/g, obj.id);
    output = output.replace(/{%DESCRIPTION%}/g, obj.description);

    if (!obj.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

