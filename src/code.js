 var save = function(result, element) {
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
                             save(result, element)
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



 // ---------------------------

 $("#submit").click(function() {
     // alert($("#verb").val());
     // console.log(window.verbresults);
     var words = $("#verb").val().split(" ");
     var show = "";
     var first = true;
     for (var key in words) {
         if (words.hasOwnProperty(key)) {
             var word = words[key];

             var cleanedword = cleanword(word);
             var found = window.verbresults[cleanedword];

             if (found && found != []) {
                 show = show + "<span class = 'posibilidades'>"
                 show = show + showverb(found, first, word);
                 show = show + "</span>";
             } else {
                 show = show + word + " ";
             }
         }
         first = false;
     }
     $("#result").html(show);
 });

 var showverb = function(found, first, word) {

     for (var key in found) {
         if (found.hasOwnProperty(key)) {
             var element = found[key];

             var expanded = expand(element);
             show = "<span class = 'desconjugado'>" + expanded + "</span>" + " " + "<span class = 'verbo'>" + word + "</span>" + " "
                 //  JSON.stringify(found) +


         }
     }
     return show;
 };
 var expand = function(found) {
     var pronomb = getpronombre(found);
     var infinitive = found.infinitive;
     var tiempo = gettiempo(found);
     var modo = getmodo(found);

     return tiempo + " " + pronomb + " " + modo + " " + infinitive;
 };

 var getpronombre = function(found) {
     switch (found.form) {
         case "form_1s":
             return "yo"
             break;
         case "form_2s":
             return "tu"
             break;
         case "form_3s":
             return "él"
             break;
         case "form_1p":
             return "nosotros"
             break;
         case "form_2p":
             return "ustedes"
             break;
         case "form_3p":
             return "ellos"
             break;
         default:
             return "";
     }
 };
 var getmodo = function(found) {
     switch (found.mood) {
         case "Imperativo Afirmativo":
             return "debe"
             break;
         case "Imperativo Negativo":
             return "no-debe"
             break;
         case "Indicativo":
             return ""
             break;
         case "Subjuntivo":
             return ""
             break;
         default:
             return "";
     }
 };
 var gettiempo = function(found) {

     switch (found.tense) {
         case "Presente":
             return ""
             break;
         case "Condicional":
             return "si"
             break;
         case "Condicional perfecto":
             return "si"
             break;
         case "Futuro":
             return "futuro"
             break;
         case "Futuro perfecto":
             return "futuro"
             break;
         case "Imperfecto":
             return "antes"
             break;
         case "Pluscuamperfecto":
             return "antes antes"
             break;
         case "Presente perfecto":
             return ""
             break;
         case "Pretérito":
             return "antes"
             break;
         case "Pretérito anterior":
             return "ya"
             break;
         default:
             return "";
     }


 };

 var cleanword = function(word) {
     word = word.replace(/[.*+?^${}()?¡!¡¿| [\]\\]/g, "")
     word = word.toLowerCase();
     return word;
 };