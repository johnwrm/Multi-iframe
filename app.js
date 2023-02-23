const contenedorIframeTerm = document.getElementById('frameTerm');
const contenedorIframeOtros = document.getElementById('otros');
const contenedorIframeD5 = document.getElementById('divD5');
const infoTerm = document.getElementById("infoTerm");
const divAddClick = document.getElementById("botones");
const checks = document.getElementsByClassName('form-check-input');
const AddBtnSelector = document.getElementById("AddBtnSelector");
const AddBtbNombre = document.getElementById("AddBtbNombre");
const tabla = document.getElementById("tabla");
const tablaPaso = document.getElementById("tablaPaso");
const tablaTbodyPaso = document.getElementById("tablaTbodyPaso");
const SelectorPaso = document.getElementById("SelectorPaso");
const AccionPaso = document.getElementById("AccionPaso");
const ValorPaso = document.getElementById("ValorPaso");
const IntervaloPaso = document.getElementById("IntervaloPaso");

const URLactual = window.location.protocol + "//" + window.location.host;
document.getElementById('urlRaiz').value = URLactual;

var Principal;
var contadorId = 0;
var conteoTurnosTabla = 1;

var intervalPaso;
var CheckSel = {};
var arrayAcciones = [];
const observerMap = {};

const botonesInicio = [
    {
        selector: "#lblNotificacionCerrar",
        nombre: "X Notificación"
    },
    {
        selector: ".cerrar",
        nombre: "X Modal"
    },
    {
        selector: "#cPHPri_lnkBuscarTurno",
        nombre: "Buscar"
    }
];

var arrayAcciones = [
    {
        selector: "#cPHPri_ucCli_dllTipoIdentificacion",
        accion: "seleccionar",
        valor: 2,
        intervalo: 500
    },
    {
        selector: "#cPHPri_ucCli_txtIdentificacion",
        accion: "escribir",
        valor: 123456,
        intervalo: 500
    },
    {
        selector: "#cPHPri_MenuEdicionDatosUsuario_lnkBuscar",
        accion: "click",
        intervalo: 500
    },
    {
        selector: "#cPHPri_ucColas_gv > tbody > tr:nth-child(1) > td:nth-child(3)",
        accion: "click",
        intervalo: 1000
    },
    {
        selector: "#cPHPri_MenuEdicionTurno_lnkSinImpresion",
        accion: "click",
        intervalo: 1000
    }
];

window.addEventListener('load', function () {

    CheckSel = {
        '1': "/Paginas/Operacion/ElementosSistema/Terminal.aspx?idTerminal=",
        '2': "/Paginas/Operacion/ElementosSistema/Selector.aspx?idSelector=",
    }

    let elementobj = {
        id: 'D5',
        titulo: 'Titulo',
        tituloIframe: 'TituloIframe',
        btnEliminar: 'none', //none o inline
        classDiv0: "col-xl-12 col-md-12",
        url: URLactual,
        contenedorIframe: contenedorIframeD5
    }

    Iframe.Agregar(elementobj);

    botonesInicio.forEach(function (btn) {
        AddBtnSelector.value = btn.selector;
        AddBtbNombre.value = btn.nombre;
        $("#addClick").click();
    });

    arrayAcciones.forEach(function (accion) {
        SelectorPaso.value = accion.selector;
        AccionPaso.value = accion.accion;
        ValorPaso.value = accion.valor;
        IntervaloPaso.value = accion.intervalo;

        $('#addPaso').click();
    });

});

const Iframe = {

    Agregar: async function (elemento) {

        const tipoElemento = CheckSeleccionado();

        const iframe = document.createElement("iframe"); //iframeCacheado(elemento.url);//

        iframe.src = elemento.url;

        iframe.className =
            elemento.url.includes("Terminal") ||
                elemento.url.includes("Selector") ||
                tipoElemento === "3" ||
                tipoElemento === "4"
                ? "embed-responsive-item cterminal"
                : "embed-responsive-item";

        iframe.setAttribute("scrolling", "auto");
        iframe.id = "If" + elemento.id;
        iframe.setAttribute("allowfullscreen", "true");

        /**
         * div principal
         */
        const divIfterm = document.createElement("div");
        divIfterm.className = elemento.classDiv0;

        const div1 = document.createElement('div');
        div1.className = "card shadow mb-6";

        /**
         * Ancla al div
         */
        const a = document.createElement('a');
        a.href = "#" + elemento.id;
        a.className = "d-block card-header py-3";
        a.dataset.toggle = "collapse";
        a.setAttribute("role", "button");
        a.setAttribute("aria-expanded", "false");

        /**
         * Titulo de la tarjeta
         */
        const h6 = document.createElement("h6");
        h6.className = "m-0 font-weight-bold text-primary";
        h6.textContent = elemento.tituloIframe;

        /**
         * div que contiene los botones de la tarjeta
         */
        const div2 = document.createElement("span");
        //div2.setAttribute("class", "row mt-1 mb-0 btnRecargarEliminar");
        div2.className = "btn-group row btnRecargarEliminar";
        div2.setAttribute("role", "group");

        // Crea el botón de zoom +
        const zoomInButton = document.createElement('button');
        zoomInButton.classList.add('btn', 'btn-info');
        zoomInButton.innerHTML = '<img src="./img/magnifying-glass-plus-solid.svg"></img>';
        zoomInButton.addEventListener('click', () => {
            iframe.contentWindow.document.body.style.zoom = parseFloat(iframe.contentWindow.document.body.style.zoom || '1') + 0.1;
        });

        // Crea el botón de zoom -
        const zoomOutButton = document.createElement('button');
        zoomOutButton.classList.add('btn', 'btn-info');
        zoomOutButton.innerHTML = '<img src="./img/magnifying-glass-minus-solid.svg"></img>';
        zoomOutButton.addEventListener('click', () => {
            iframe.contentWindow.document.body.style.zoom = parseFloat(iframe.contentWindow.document.body.style.zoom || '1') - 0.1;
        });

        /**
         * boton que actualiza el iframe
         */
        const botonActualizar = document.createElement("button");
        botonActualizar.type = "button";
        botonActualizar.className = "btn btn-primary";
        botonActualizar.innerHTML = "<i><img src='./img/arrows-rotate.svg'></i>"
        botonActualizar.addEventListener("click", function () {
            Iframe.Actualizar(elemento);
        });

        /**
         * boton que elimina la tarjeta
         */
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-danger";
        botonEliminar.style.display = elemento.btnEliminar;
        botonEliminar.innerHTML = "X";
        botonEliminar.addEventListener("click", function () {
            Iframe.Eliminar(elemento);
        });

        /**
         * Div que colapsa
        */
        const div5 = document.createElement("div");
        div5.className = "collapse show";
        div5.id = elemento.id;

        /**
         * Div cuerpo de la tarjeta
         */
        const div6 = document.createElement("div");
        div6.className = "card-body";

        /**
         * Div cuerpo de la tarjeta
        */
        const div7 = document.createElement("div");
        div7.className = "embed-responsive d5";

        const divOverly = document.createElement("div");
        divOverly.className = "overlay";

        a.appendChild(h6);
        div1.appendChild(a);

        //div4.appendChild();
        //div3.appendChild();
        div2.appendChild(zoomOutButton);
        div2.appendChild(zoomInButton);
        div2.appendChild(botonActualizar);
        div2.appendChild(botonEliminar);

        div7.appendChild(divOverly);
        div7.appendChild(iframe);
        div6.appendChild(div7);
        div5.appendChild(div6);

        div1.appendChild(div2);
        div1.appendChild(div5);
        divIfterm.appendChild(div1);

        elemento.iframe = iframe;
        elemento.h6 = h6;
        elemento.divOverly = divOverly;
        elemento.divOverly.style.visibility = "visible";
        elemento.divIfterm = divIfterm;

        elemento.contenedorIframe.appendChild(divIfterm);

        if (tipoElemento === "1" && elemento.url.includes("Terminal")) {
            Iframe.CardInfoTerminal(elemento);
        }

        Iframe.CargaIframe(elemento);
    },

    Actualizar: function (elemento) {
        elemento.divOverly.style.visibility = "visible";
        elemento.iframe.contentWindow.location.reload(true);
        //iframe.setAttribute("src", iframe.contentWindow.location.href);
    },

    Eliminar: function (elemento) {
        if (elemento.observer) {
            elemento.observer.disconnect();
        }
        if (elemento.divIfterm) {
            elemento.iframe.remove();
            elemento.divIfterm.remove();
        }
        if (elemento.divInfoTerm) {
            elemento.divInfoTerm.remove();
        }
    },

    CargaIframe: function (elemento) {

        const iframe = elemento.iframe;
        const contenidoIframe = iframe.contentWindow;
        iframe.addEventListener("load", function () {
            iframe.removeEventListener("load", this);
            elemento.divOverly.style.visibility = "hidden";
            const tipoElemento = CheckSeleccionado();

            elemento.h6.textContent = contenidoIframe.originaltitle;

            if (elemento.id === "D5") {
                Principal = iframe;
            }

            if (tipoElemento === "1" && elemento.id !== "D5" && elemento.url.includes("Terminal")) {
                elemento.span0.innerHTML = contenidoIframe.document.querySelector("#cPHPri_lblTitInfoTerminal").innerHTML;
                elemento.h6.textContent = contenidoIframe.document.querySelector("#cPHPri_lblTitInfoTerminal").innerHTML;
                Iframe.InfoTerminal(elemento);
            }

            contenidoIframe.addEventListener("beforeunload", function () {
                elemento.divOverly.style.visibility = "visible";
            });
        });

    },

    CardInfoTerminal: function (elemento) {
        const aInf = document.createElement('a');
        aInf.href = "#" + elemento.id;

        const div = document.createElement("div");
        div.className = "col-xl-3 col-md-6";

        const card = document.createElement("div");
        card.className = "card border-left-primary shadow";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const table = document.createElement("table");
        //table.className = "table-sm";

        const span0 = document.createElement("span");
        const span1 = document.createElement("span");
        const span2 = document.createElement("span");
        const span3 = document.createElement("span");
        const span4 = document.createElement("span");

        span4.style.position = "absolute";
        span4.style.top = "5px";
        span4.style.width = "96%";
        span4.style.overflow = "hidden";

        const checkVA = document.createElement("input");
        checkVA.type = "checkbox";
        checkVA.className = "ml-2";
        checkVA.setAttribute("title", "Habilitar el tiempo de video para ocupar y llamar en automatico");

        elemento.span0 = span0;
        elemento.span1 = span1;
        elemento.span2 = span2;
        elemento.span3 = span3;
        elemento.span4 = span4;

        elemento.divCard = cardBody;
        elemento.checkVA = checkVA;

        aInf.append(span0);

        for (let i = 0; i < 3; i++) {
            const row = document.createElement("tr");

            for (let j = 0; j < 2; j++) {
                const column = document.createElement("td");

                if (i === 0) {
                    column.appendChild((j == 0) ? aInf : span1);
                } else if (i === 1) {
                    column.appendChild((j == 0) ? span2 : span3);
                    if (j == 1) {
                        column.appendChild(checkVA);
                    }
                } else {
                    const input = document.createElement("input");
                    input.type = "number";
                    input.className = "form-control";
                    input.value = (j === 0) ? 5 : 0;
                    switch (j) {
                        case 0:
                            elemento.input1 = input;
                            input.setAttribute("placeholder", "t Ocupar");
                            break;
                        case 1:
                            elemento.input2 = input;
                            input.setAttribute("placeholder", "t Llamar");
                            break;
                    }
                    column.appendChild(input);
                }

                row.appendChild(column);
            }

            table.appendChild(row);
        }

        cardBody.appendChild(table);
        cardBody.appendChild(span4);
        card.appendChild(cardBody);
        div.appendChild(card);

        elemento.divInfoTerm = div;
        elemento.BanderaEstadoTerm = 0;
        infoTerm.appendChild(div);

    },

    InfoTerminal: function (elemento) {
        const iframeDocument = elemento.iframe.contentDocument || elemento.iframe.contentWindow.document;
        const lblTiempoEstadoActual = iframeDocument.querySelector("#lblTiempoEstadoActual");
        const divNotificacion = iframeDocument.querySelector("#divNotificacion");
        divNotificacion.style.maxWidth = "100%";
        const divVentanaModal = iframeDocument.querySelector("#divVentanaModal");
        const updateProgressGeneral = iframeDocument.querySelector("#UpdateProgressGeneral");
        const check = elemento.checkVA;

        let previousEstado = "";
        let previousValues = {
            span1: "",
            span2: "",
            span3: "",
            span4: "",
        };

        const observer = new MutationObserver((mutations) => {

            mutations.forEach((mutation) => {
                let isVentanaModalVisible = window.getComputedStyle(divVentanaModal).display === "flex";
                let isUpdateProgressGeneralVisible = window.getComputedStyle(updateProgressGeneral).display !== "none";

                if (isVentanaModalVisible || isUpdateProgressGeneralVisible) {
                    elemento.divCard.classList.add("cardVelo");
                } else {
                    elemento.divCard.classList.remove("cardVelo");
                }

                const estado = iframeDocument.querySelector("#cPHPri_lblEstadoTerminal").innerHTML;
                const tVideo = check.checked ? iframeDocument.querySelector("#videoRemoto").currentTime : formatTimeInt(lblTiempoEstadoActual.innerHTML);

                const newValues = {
                    span1: `Turno: ${iframeDocument.getElementById("cPHPri_lblNumeroTurno").innerText}`,
                    span2: `${iframeDocument.querySelector("#cPHPri_imgEstadoActualTer").outerHTML} ${estado} ${lblTiempoEstadoActual.innerHTML}`,
                    span3: `t Video= ${formatTime(tVideo)}`,
                    span4: divNotificacion.outerHTML,
                };

                Object.keys(newValues).forEach((key) => {
                    if (newValues[key] !== previousValues[key]) {
                        elemento[key].innerHTML = newValues[key];
                    }
                });

                if (elemento.input1.value > 0 && elemento.input2.value > 0) {
                    if (previousEstado === "Llamando" && tVideo > elemento.input1.value && elemento.BanderaEstadoTerm === 0) {
                        Iframe.PasoOcupar(elemento);
                    }

                    if (previousEstado === "Ocupado" && tVideo > elemento.input2.value && elemento.BanderaEstadoTerm === 1) {
                        Iframe.PasoLlamar(elemento);
                    }
                }

                if (previousEstado !== "Llamando" && estado === "Llamando") {
                    elemento.previousEstado = previousValues.span2;
                    Iframe.RegistroTabla(elemento);
                }

                previousValues = newValues;
                previousEstado = estado;
            });
        });

        const elementosObservados = [iframeDocument.querySelector("#lblTiempoEstadoActual", "#divNotificacion")];

        elementosObservados.forEach((element) => {
            observer.observe(element, {
                childList: true,
                characterData: true,
                subtree: true,
            });
        });


        elemento.observer = observer;

        /*
                const iframeDocument = elemento.iframe.contentDocument || elemento.iframe.contentWindow.document;
                const lblTiempoEstadoActual = iframeDocument.querySelector("#lblTiempoEstadoActual");
                const divNotificacion = iframeDocument.querySelector("#divNotificacion");
                const divVentanaModal = iframeDocument.querySelector("#divVentanaModal");
                const updateProgressGeneral = iframeDocument.querySelector("#UpdateProgressGeneral");
                const check = elemento.checkVA;
        
                let previousEstado = "";
                let previousValues = {
                    span1: "",
                    span2: "",
                    span3: "",
                    span4: "",
                };
        
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        let isVentanaModalVisible = window.getComputedStyle(divVentanaModal).display === "flex";
                        let isUpdateProgressGeneralVisible = window.getComputedStyle(updateProgressGeneral).display !== "none";
        
                        if (isVentanaModalVisible || isUpdateProgressGeneralVisible) {
                            elemento.divCard.classList.add("cardVelo");
                        } else {
                            elemento.divCard.classList.remove("cardVelo");
                        }
        
                        const estado = iframeDocument.querySelector("#cPHPri_lblEstadoTerminal").innerHTML;
                        const tVideo = check.checked ? iframeDocument.querySelector("#videoRemoto").currentTime : formatTimeInt(lblTiempoEstadoActual.innerHTML);
        
                        const newValues = {
                            span1: `Turno: ${iframeDocument.getElementById("cPHPri_lblNumeroTurno").innerText}`,
                            span2: `${iframeDocument.querySelector("#cPHPri_imgEstadoActualTer").outerHTML} ${estado} ${lblTiempoEstadoActual.innerHTML}`,
                            span3: `t Video= ${formatTime(tVideo)}`,
                            span4: divNotificacion.outerHTML,
                        };
        
                        Object.keys(newValues).forEach((key) => {
                            if (newValues[key] !== previousValues[key]) {
                                elemento[key].innerHTML = newValues[key];
                            }
                        });
        
                        if (elemento.input1.value > 0 && elemento.input2.value > 0) {
                            if (previousEstado === "Llamando" && tVideo > elemento.input1.value && elemento.BanderaEstadoTerm === 0) {
                                Iframe.PasoOcupar(elemento);
                            }
        
                            if (previousEstado === "Ocupado" && tVideo > elemento.input2.value && elemento.BanderaEstadoTerm === 1) {
                                Iframe.PasoLlamar(elemento);
                            }
                        }
        
                        if (previousEstado !== "Llamando" && estado === "Llamando") {
                            elemento.previousEstado = previousValues.span2;
                            Iframe.RegistroTabla(elemento);
                        }
        
                        previousValues = newValues;
                        previousEstado = estado;
                    });
                });
        
                const elements = [lblTiempoEstadoActual, divNotificacion]//, divVentanaModal, updateProgressGeneral];
                elements.forEach((element) => {
                    observer.observe(element, {
                        childList: true,
                        characterData: true,
                        subtree: true,
                    });
                });*/

    },

    PasoOcupar: function (elemento) {
        var element = elemento.iframe.contentWindow.document.querySelector("#cPHPri_lnkOcupar");
        element.click();
        elemento.BanderaEstadoTerm = 1;
    },

    PasoLlamar: function (elemento) {
        var element = elemento.iframe.contentWindow.document.querySelector("#cPHPri_lnkLlamar");
        element.click();
        elemento.BanderaEstadoTerm = 0;
    },

    RegistroTabla: function (elemento) {
        const tr = document.createElement("tr");
        const tdTerminal = document.createElement("td");
        const tdTurno = document.createElement("td");
        const tdConteo = document.createElement("td");
        const tdTprevio = document.createElement("td");

        tdTerminal.innerText = elemento.span0.innerText;
        tdTurno.innerText = elemento.span1.innerText.replace('Turno: ', '');
        tdConteo.innerText = conteoTurnosTabla;
        tdTprevio.innerHTML = elemento.previousEstado;

        tr.appendChild(tdTerminal);
        tr.appendChild(tdTurno);
        tr.appendChild(tdConteo);
        tr.appendChild(tdTprevio);

        tabla.appendChild(tr);

        conteoTurnosTabla = conteoTurnosTabla + 1;
    }
}

var CheckSeleccionado = function () {
    for (i = 0; i < document.forms[0].elemento.length; i++)
        if (document.forms[0].elemento[i].checked) {
            return document.forms[0].elemento[i].value;
        }
}

var resetForm = function () {
    document.getElementById('Elemento-From').reset();
    document.getElementById('urlRaiz').value = URLactual;
}

var ClickTodos = async function (selectorElemento) {
    const iframes = Array.from(document.querySelectorAll("iframe"));
    const selector = selectorElemento;

    iframes.forEach(iframe => {
        const elemento = iframe.contentDocument.querySelector(selector);
        if (elemento) {
            elemento.click();
        }
    });
}

function ejecutarAccionesEnIframes(arrayAcciones) {
    // Obtener todos los iframes en la página
    var iframes = document.getElementsByTagName("iframe");

    // Recorrer cada iframe
    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];

        // Obtener el documento dentro del iframe
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        var nuevoIntervalo = 0;

        // Recorrer cada acción en el array de acciones
        for (var j = 0; j < arrayAcciones.length; j++) {
            var accion = arrayAcciones[j];

            // Obtener el elemento correspondiente dentro del iframe
            var elemento = iframeDoc.querySelector(accion.selector);

            // Verificar si el elemento existe en el iframe
            if (elemento) {
                // Obtener el intervalo de tiempo especificado
                var intervalo = accion.intervalo || 1000;

                nuevoIntervalo = nuevoIntervalo + parseInt(intervalo);

                // Esperar el intervalo de tiempo especificado
                setTimeout((function (accion, elemento) {
                    return function () {
                        /*let now = new Date();
                        console.log(accion + ' ' + elemento.id + ' ' + now.toLocaleTimeString());*/

                        // Ejecutar la acción correspondiente en el elemento
                        if (accion.accion === "click") {
                            elemento.click();
                        } else if (accion.accion === "escribir") {
                            elemento.value = accion.valor;
                        } else if (accion.accion === "seleccionar") {
                            elemento.value = accion.valor;
                            var evento = document.createEvent("HTMLEvents");
                            evento.initEvent("change", false, true);
                            elemento.dispatchEvent(evento);
                        }
                    };
                })(accion, elemento), nuevoIntervalo);
            }
        }
    }
}

var formatTimeInt = function (time) {
    const fecha = new Date(`1970-01-01T${time}Z`); // Crea un objeto de fecha a partir de la cadena de tiempo
    const entero = Math.floor(fecha.getTime() / 1000); // Convierte el tiempo en milisegundos a segundos
    return entero;
}

var formatTime = function (time) {
    const fecha = new Date(time * 1000); // Crea un objeto de fecha a partir del entero (multiplicado por 1000 para convertir los segundos a milisegundos)
    const tiempoFormateado = fecha.toISOString().substr(11, 8);
    return tiempoFormateado; // Output: 01:01:01
}

function tablaAArray(tabla) {
    const cabeceras = [];
    const filas = [];

    // Obtener las cabeceras de la tabla
    const ths = tabla.querySelectorAll('thead th');
    ths.forEach(th => cabeceras.push(th.textContent.toLowerCase()));

    // Obtener las filas de la tabla
    const trs = tabla.querySelectorAll('tbody tr');
    trs.forEach(tr => {
        const fila = {};
        const tds = tr.querySelectorAll('td');
        tds.forEach((td, i) => fila[cabeceras[i]] = td.textContent);
        filas.push(fila);
    });

    // Convertir los objetos a objetos JSON
    //const filasJSON = filas.map(fila => JSON.stringify(fila));
    return filas;
}



$('#btnAgregar').click(function () {
    $("#ModalAddElement").modal();
});

$('#addClick').click(function () {

    if (!AddBtbNombre.value || !AddBtnSelector.value) {
        return alert("Debe completar toda la información");
    }

    const div = document.createElement("span");
    div.setAttribute('class', 'btn-group');
    div.setAttribute('role', 'group');

    const boton = document.createElement('button');
    boton.setAttribute('class', 'ml-2 btn btn-primary mt-2');
    boton.setAttribute('onClick', 'ClickTodos("' + AddBtnSelector.value + '")');
    boton.innerHTML = `<img src="./img/Clic.svg"></img> ${AddBtbNombre.value}`;

    const BotonDel = document.createElement('button');
    BotonDel.setAttribute('class', 'btn btn-danger mt-2');
    BotonDel.setAttribute('onClick', 'this.parentNode.remove()');
    BotonDel.innerHTML = `<img src="./img/eliminar.svg"></img>`;

    div.appendChild(boton);
    div.appendChild(BotonDel);
    divAddClick.appendChild(div);

    AddBtbNombre.value = "";
    AddBtnSelector.value = "";

});

$('#llamar').click(function () {
    ClickTodos('#cPHPri_lnkLlamar');
});

$('#ocupar').click(function () {
    ClickTodos('#cPHPri_lnkOcupar');
});

$('#cerrart').click(function () {
    ClickTodos('#cPHPri_lnkCerrarTerminal');
    ClickTodos('#cPHPri_MenuEdicionCerrarSelector_lnkCerrarSelector');
    ClickTodos('#cPHPri_MenuEdicionCerrarSelector_lnkCerrar');
});

$('#cerrartIf').click(function () {
    var buttons = $("button.btn-danger:contains('X')");
    var count = buttons.length;
    buttons.slice(0, count - 1).click();
});

$('#actualizarIf').click(function () {
    var buttons = $("button.btn-primary:has(i)");
    var count = buttons.length;
    buttons.slice(0, count - 1).click();
});

$('#play').click(function () {
    var totalIntervalos = 0;
    clearInterval(intervalPaso);
    arrayAcciones = [];
    arrayAcciones = tablaAArray(tablaPaso);

    for (var i = 0; i < arrayAcciones.length; i++) {
        totalIntervalos += parseInt(arrayAcciones[i].intervalo);
    }

    intervalPaso = setInterval(function () {
        ejecutarAccionesEnIframes(arrayAcciones);
    }, totalIntervalos + 1000);
});

$('#stop').click(function () {
    clearInterval(intervalPaso);
});

$('#addPaso').click(function () {

    const div = document.createElement("span");
    div.setAttribute('class', 'btn-group');
    div.setAttribute('role', 'group');

    const tr = document.createElement('tr');
    const td0 = document.createElement('td');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');

    td0.innerText = SelectorPaso.value;
    td1.innerText = AccionPaso.value;
    td2.innerText = ValorPaso.value;
    td3.innerText = IntervaloPaso.value;

    const editarBtn = document.createElement('button');
    editarBtn.className = 'btn btn-primary';
    editarBtn.innerHTML = "<i><img src='./img/pen-to-square-solid.svg'></i>";
    editarBtn.addEventListener('click', function () {
        const editando = tablaTbodyPaso.getElementsByClassName('editando');

        if (editando.length > 0) {
            editando[0].classList.remove("editando");
        }

        // obtén los valores de las otras cuatro columnas de esta fila
        const fila = editarBtn.parentNode.parentNode.parentNode;
        fila.className = 'editando';
        const valores = [];
        for (let j = 0; j < 4; j++) {
            valores.push(fila.children[j].textContent);
        }

        SelectorPaso.value = valores[0];
        AccionPaso.value = valores[1];
        ValorPaso.value = valores[2];
        IntervaloPaso.value = valores[3];

    });

    const borrarBtn = document.createElement('button');
    borrarBtn.className = 'btn btn-danger';
    borrarBtn.innerHTML = "<i><img src='./img/eliminar.svg'></i>"
    borrarBtn.setAttribute('onClick', 'this.parentNode.parentNode.parentNode.remove()');

    div.appendChild(editarBtn);
    div.appendChild(borrarBtn);
    td4.appendChild(div);

    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    tablaTbodyPaso.appendChild(tr);
    SelectorPaso.value = "";
    AccionPaso.value = "";
    ValorPaso.value = "";
    IntervaloPaso.value = "";

});

$('#guardarPaso').click(function () {
    const nuevosValores = [];
    nuevosValores[0] = SelectorPaso.value;
    nuevosValores[1] = AccionPaso.value;
    nuevosValores[2] = ValorPaso.value;
    nuevosValores[3] = IntervaloPaso.value;

    // actualiza la fila correspondiente en la tabla
    const fila = tablaTbodyPaso.getElementsByClassName("editando")[0];
    for (let i = 0; i < 4; i++) {
        fila.children[i].textContent = nuevosValores[i];
    }
    // quita la clase "editando" de la fila
    fila.classList.remove("editando");
    SelectorPaso.value = "";
    AccionPaso.value = "";
    ValorPaso.value = "";
    IntervaloPaso.value = "";
});

$('#btnAddElemento').click(function () {
    const urlRaiz = $('#urlRaiz').val();
    const idElemento = $('#idElemento').val().split(',');
    const tipoElemento = CheckSeleccionado();

    CheckSel['3'] = Principal.contentWindow.location.href;
    CheckSel['4'] = urlRaiz;
    CheckSel['5'] = CheckSel['4'];

    if (!urlRaiz || !idElemento || (tipoElemento != 1 && tipoElemento != 2 && !urlRaiz)) {
        return alert("Debe completar toda la información");
    }

    $("#ModalAddElement").modal('hide');

    idElemento.map(function (id) {
        let elementobj = {
            id: contadorId++,
            titulo: 'Titulo',
            tituloIframe: 'Pag.',
            btnEliminar: 'inline',
            classDiv0: "col-xl-6 col-md-12",
            contenedorIframe: contenedorIframeTerm,
            url: (tipoElemento == 1 || tipoElemento == 2) ? urlRaiz + CheckSel[tipoElemento] + id :
                (tipoElemento == 3) ? Principal.contentWindow.location.href :
                    (tipoElemento == 4) ? CheckSel[tipoElemento] :
                        (tipoElemento == 5) ? CheckSel[tipoElemento] : '',
        };

        if (tipoElemento == 5) {
            elementobj.classDiv0 = "col-xl-12 col-md-12";
            elementobj.contenedorIframe = contenedorIframeOtros;
        }
        Iframe.Agregar(elementobj);
    });
    resetForm();
});

// Definir el array de acciones a ejecutar
/*


// Llamar a la función para ejecutar las acciones en los iframes
 setInterval(function() {
    ejecutarAccionesEnIframes(arrayAcciones);
}, 7000);
*/

class MyComponent extends HTMLElement {
    constructor() {
        super();

        // Crea el contenedor de la tarjeta
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card', 'col-md-6', 'col-sm-12');

        // Crea el encabezado de la tarjeta
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center');
        cardHeader.innerHTML = `
        <h4>Componente con iframe</h4>
        <div class="btn-group">
          <button class="btn btn-primary mr-2" id="zoom-in"><i class="bi bi-zoom-in"></i></button>
          <button class="btn btn-primary" id="zoom-out"><i class="bi bi-zoom-out"></i></button>
        </div>
      `;

        // Crea el cuerpo de la tarjeta
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Crea el iframe
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', this.getAttribute('iframe-src'));

        // Agrega el iframe al cuerpo de la tarjeta
        cardBody.appendChild(iframe);

        // Agrega los elementos a la tarjeta
        cardContainer.appendChild(cardHeader);
        cardContainer.appendChild(cardBody);

        // Agrega la tarjeta al componente
        this.appendChild(cardContainer);

        // Oculta el cuerpo de la tarjeta al hacer click en el encabezado
        cardHeader.addEventListener('click', () => {
            cardBody.classList.toggle('d-none');
        });

        // Zoom in/out del contenido del iframe
        const zoomInButton = cardHeader.querySelector('#zoom-in');
        const zoomOutButton = cardHeader.querySelector('#zoom-out');
        zoomInButton.addEventListener('click', () => {
            iframe.contentDocument.body.style.transform = 'scale(1.2)';
        });
        zoomOutButton.addEventListener('click', () => {
            iframe.contentDocument.body.style.transform = 'scale(1)';
        });

        // Elimina el componente al hacer click en el botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'float-right', 'mt-2', 'mr-2');
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        cardHeader.appendChild(deleteButton);
        deleteButton.addEventListener('click', () => {
            this.parentNode.removeChild(this);
        });
    }
}

// Define el nombre del componente y su atributo src del iframe
customElements.define('my-component', MyComponent);



