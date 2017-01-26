var save1 = function(result, element) {
    var prevvalue = result[element.conjugation];
    // console.log(prevvalue);
    if (prevvalue && isArray(prevvalue)) {
        var newval = prevvalue.concat([element])
            // console.log(newval);
        result[element.conjugation] = newval;


    } else {
        result[element.conjugation] = [element];
    }
}

var getverb = function(verb) {
    return verbresults[verb];
}
var isArray = function(a) {
    return (!!a) && (a.constructor === Array);
};

var verbresults;
var transformed = {};
var i = 0
var createobjects = function(data) {
    var result = [];
    var header
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var element = data[key];

            if (key == 0) {
                header = element

            } else {
                var obj = createobject(header, element);
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var element = obj[key];
                        if (element.conjugation != "") {
                            save1(result, element)
                            i++;
                            if (i % 10 == 0) {
                                // console.log(i + "!");
                            }
                        }
                    }
                }

            }
        }

    }
    // console.log(result);
    console.log(i + "!");
    return result;
};
var createobject = function(header, row) {

    var arr1 = [createobj(row, 7, "form_1s"),
        createobj(row, 8, "form_2s"),
        createobj(row, 9, "form_3s"),
        createobj(row, 10, "form_1p"),
        createobj(row, 11, "form_2p"),
        createobj(row, 12, "form_3p")
    ]
    return arr1;
};

var createobj = function(row, form, formname) {
    var obj = {

        infinitive: row[0],
        mood: row[2],
        tense: row[4],
        conjugation: row[form],
        form: formname
    }
    return obj;
};

$.getJSON('/src/jehle_verb_database.json', function(response) {
    cdata = response.data;
    //.slice(0, 4);
    verbresults = createobjects(cdata);
    window.verbresults = verbresults;

    document.getElementById("result").innerHTML = "listo";
})