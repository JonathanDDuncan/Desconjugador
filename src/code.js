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
 var guid = function() {
     return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
 }

 var s4 = function() {
     return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
 }
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

 $.getJSON('src/jehle_verb_database.json', function(response) {
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
     var worditems = [];
     var first = true;
     for (var key in words) {
         if (words.hasOwnProperty(key)) {
             var word = words[key];

             //  var cleanedword = cleanword(word);
             //  var found = window.verbresults[cleanedword];

             //  if (found && found != []) {
             //      show = show + "<span class = 'posibilidades'>"
             //      show = show + showverb(found, first, word);
             //      show = show + "</span>";
             //  } else {
             worditems.push(createworditem(word))

             //  }
         }
         first = false;
     }
     window.worditems = worditems;
     var view = createview(worditems);

     $("#result").html(view);
 });


 $("#analizar").click(function() {
     categorizar(worditems);
     var oracion = crearoracion();

     $("#oracion").val(oracion);
 });
 var crearoracion = function() {
     var oracion = ""
     oracion += $('#inputtiempo').val().trim() + " ";
     oracion += $('#inputlugar').val().trim() + " ";
     oracion += $('#inputobjeto').val().trim() + " ";
     oracion += $('#inputsujeto').val().trim() + " ";
     oracion += $('#inputverbo').val().trim() + " ";
     oracion += $('#inputpregunta').val().trim() + " ";
     oracion = oracion.replace(".", "");
     oracion = oracion.replace("   ", " ");
     oracion = oracion.replace("  ", " ");
     oracion = oracion.trim();
     oracion += ".";
     return oracion;
 };
 var createworditem = function(word) {
     var item = {};
     item.type = "";
     item.originalword = word;
     item.guid = guid();

     return item;
 };
 var categorizar = function(worditems) {

     $('#inputtiempo').val("");
     $('#inputlugar').val("");
     $('#inputobjeto').val("");
     $('#inputsujeto').val("");
     $('#inputverbo').val("");
     $('#inputpregunta').val("");
     for (var key in worditems) {
         if (worditems.hasOwnProperty(key)) {
             var element = worditems[key];

             switch (element.type) {
                 case "tiempo":
                     $('#inputtiempo').val($('#inputtiempo').val().trim() + " " + element.originalword)
                     break;
                 case "lugar":
                     $('#inputlugar').val($('#inputlugar').val().trim() + " " + element.originalword)
                     break;
                 case "objecto":
                     $('#inputobjeto').val($('#inputobjeto').val().trim() + " " + element.originalword)
                     break;
                 case "sujeto":
                     $('#inputsujeto').val($('#inputsujeto').val().trim() + " " + element.originalword)
                     break;
                 case "verbo":
                     var result = getverb(element.originalword);
                     if (result) {
                         var analizado = expand(result[0]);
                         $('#inputtiempo').val($('#inputtiempo').val().trim() + " " + analizado.tiempo)
                         $('#inputsujeto').val($('#inputsujeto').val().trim() + " " + analizado.pronomb)
                         $('#inputverbo').val($('#inputverbo').val().trim() + " " + analizado.modo + " " + analizado.infinitive)
                     } else {
                         $('#inputverbo').val($('#inputverbo').val().trim() + " " + element.originalword)
                     }
                     break;
                 case "pregunta":
                     $('#inputpregunta').val($('#inputpregunta').val().trim() + " " + element.originalword)
                     break;

                 default:

             }
         }

     }
 };
 var createview = function(worditems) {
     var view = ""

     for (var key in worditems) {
         if (worditems.hasOwnProperty(key)) {
             var element = worditems[key];

             if (element.type == "verb") {
                 view = view + "<div class = 'entry'>" + "<span class = 'word'>" + wordtypes(element.guid) + "</span>" + "<span class = 'posibilidades'>" + element.originalword + " " + "</span>" + "</div>";
             } else {
                 view = view + "<div class = 'entry'>" + "<span class = 'word'>" + wordtypes(element.guid) + "</span>" + "<span class = 'word'>" + element.originalword + " " + "</span>" + "</div>";
             }

         }
     }
     return view;
 };

 var wordtypes = function(guid) {
     return '<select id="' + guid + '" onchange="typechange(this.id,this.value)">' +
         '<option value = "" ></option>' +
         '<option value = "tiempo" >tiempo, ¿Cuándo?</option>' +
         '<option value = "lugar" >lugar, ¿Dónde?</option>' +
         '<option value = "objecto" >objecto, ¿Qué?</option>' +
         '<option value = "sujeto" >sujeto, ¿Quién?</option>' +
         '<option value = "verbo" >verbo, ¿Qué hacen?</option>' +
         '<option value = "pregunta" >pregunta</option>' +
         '</select>'
 };
 var typechange = function(id, value) {
     var object = window.worditems;
     for (var key in object) {
         if (object.hasOwnProperty(key)) {
             var element = object[key];

             if (element.guid == id) {
                 element.type = value;
                 //  alert(JSON.stringify(element));
             }

         }
     }
 }
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
     var obj = {};
     obj.tiempo = tiempo;
     obj.pronomb = pronomb;
     obj.modo = modo;
     obj.infinitive = infinitive;

     return obj;
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