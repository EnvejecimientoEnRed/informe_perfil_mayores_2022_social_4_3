//Desarrollo de las visualizaciones
import * as d3 from 'd3';
import { numberWithCommas2 } from '../helpers';
//import { getInTooltip, getOutTooltip, positionTooltip } from './modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42', 
COLOR_ANAG_1 = '#D1834F', 
COLOR_ANAG_2 = '#BF2727', 
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0', 
COLOR_GREY_1 = '#B5ABA4', 
COLOR_GREY_2 = '#64605A', 
COLOR_OTHER_1 = '#B58753', 
COLOR_OTHER_2 = '#731854';

export function initChart(iframe) {
    //Desarrollo del gráfico
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_social_4_3/main/data/estado_civil_fallecer_2020_v2.csv', function(error,data) {
        if (error) throw error;
        
        data = data.filter(function(item) { if(item.sexo != 'Ambos sexos'){ return item; }});

        //Declaramos fuera las variables genéricas
        let margin = {top: 20, right: 20, bottom: 20, left: 55},
            width = document.getElementById('chart').clientWidth - margin.left - margin.right,
            height = document.getElementById('chart').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#chart")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        let gruposEstado = ['solteros_porc', 'casados_porc', 'viudos_porc', 'separados_porc'];

        //Ejes X
        let x = d3.scaleLinear()
            .domain([0,100])
            .range([0,width]);

        let xAxis = d3.axisBottom(x).ticks(5);
        
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //Eje Y
        let y = d3.scaleBand()
            .domain(['Mujeres','Hombres'])
            .range([0, height]);

        let yAxis = function(g) {
            g.call(d3.axisLeft(y))
        }
        
        svg.append("g")
            .attr("class", "yaxis")
            .call(yAxis);

        let color = d3.scaleOrdinal()
            .domain(gruposEstado)
            .range([COLOR_PRIMARY_1, COLOR_COMP_2, COLOR_COMP_1, COLOR_OTHER_1]);

        let stackedDataEstado = d3.stack()
            .keys(gruposEstado)
            (data);

        function init() {
            svg.append("g")
                .attr('class','chart-g')
                .selectAll("g")
                .data(stackedDataEstado)
                .enter()
                .append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                .attr('class','prueba')
                .attr("y", function(d) { return y(d.data.sexo) + y.bandwidth() / 4; })
                .attr("x", function(d) { return 0; })
                .attr("width", function(d) { return x(0); })
                .attr("height", y.bandwidth() / 2)
                .transition()
                .duration(2000)
                .attr("x", function(d) { return x(d[0]); })
                .attr("width", function(d) { return x(d[1]) - x(d[0]); });
        }

        function animateChart() {
            svg.selectAll('.prueba')
                .attr("y", function(d) { return y(d.data.sexo) + y.bandwidth() / 4; })
                .attr("x", function(d) { return 0; })
                .attr("width", function(d) { return x(0); })
                .attr("height", y.bandwidth() / 2)
                .transition()
                .duration(2000)
                .attr("x", function(d) { return x(d[0]); })
                .attr("width", function(d) { return x(d[1]) - x(d[0]); });
        }        

        /////
        /////
        // Resto - Chart
        /////
        /////
        init();

        //Animación del gráfico
        document.getElementById('replay').addEventListener('click', function() {
            animateChart();
        });

        /////
        /////
        // Resto
        /////
        /////

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_social_4_3','estado_civil_fallecimiento');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('estado_civil_fallecimiento');

        //Captura de pantalla de la visualización
        setChartCanvas();  

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            setChartCanvasImage('estado_civil_fallecimiento');
        });

        //Altura del frame
        setChartHeight(iframe);
    });    
}