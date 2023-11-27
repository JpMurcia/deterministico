import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Input, Form, Row, Select, message, Divider, Col, Tag,Layout } from "antd";
import { Menu } from 'antd';
import {

    Cascader,
    DatePicker,


    InputNumber,
    Radio,

    Switch,
    TreeSelect,
} from 'antd';
const { Header, Footer, Sider, Content } = Layout;

const { Option } = Select;
const { Item } = Form;

const layout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};


const FromDeterministico = () => {

    const InitialMatriz = [
        {
            key: 0,
            x: 5,
            y: 6,
            simbolo: "<=",
            simbolo_id: 2,
            restriccion: 1
        },
        {
            key: 1,
            x: 4,
            y: 3,
            simbolo: "<",
            simbolo_id: 1,
            restriccion: 2
        }
    ];

    const InitialMatrizVertices = [
        [0, 0],
        [1, 1],
        [1, 1]

    ];

    const InitialFuncion =
    {

        x: 1,
        y: 1,
        // simbolo: "<=",
        maxi: true,

    };
    const InitialMaxiMini = [
        {
            "id": 1,
            "nameSimbolo": "Maximizar",
            "o_state": true
        },
        {
            "id": 2,
            "nameSimbolo": "Minimizar",
            "o_state": false
        }
    ];

    const InitialSimboloRestricciones = [
        {
            "id": 2,
            "nameSimbolo": "<=",
            "o_state": 1
        }
        ,
        {
            "id": 3,
            "nameSimbolo": "=",
            "o_state": 1
        }
        ,
        {
            "id": 4,
            "nameSimbolo": ">=",
            "o_state": 1
        }
    ];

    const [modal, setModal] = useState(false);

    const [fromData, setFormData] = useState({});
    const [Simbolo, setSimbolo] = useState(InitialSimboloRestricciones);
    const [Matriz, setMatriz] = useState(InitialMatriz);
    const [MatrizVertices, setMatrizVertices] = useState(InitialMatrizVertices);
    const [PuntoOptimo, setPuntoOptimo] = useState({});
    const [FuncionObj, setFuncion] = useState(InitialFuncion);

    const [MatrizVerticesFactible, setMatrizVerticesFactible] = useState([]);


    const [FuncionObjTex, setFuncionObjTex] = useState();
    const [TablaSolucion, setTablaSolucion] = useState([]);
    const [RestriccionTex, setRestriccionTex] = useState([]);
    // const [FuncionObj, setFuncion] = useState(InitialFuncion);
    const [MostarResul, setMostarResul] = useState(true);
    const columns = [
        {
            title: 'Punto',
            dataIndex: 'punto',
            key: 'punto',
        }, {
            title: 'Coordenadas (x,y)',
            dataIndex: 'coordenadas',
            key: 'coordenadas',
        },
        {
            title: `Valor de ${FuncionObjTex}`,
            dataIndex: 'funcionObjeto',
            key: 'funcionObjeto',
        },

        {
            title: 'Estado',
            dataIndex: 'optimo',
            key: 'optimo',
            render: ((state) => <> {state == "Optimo" ? <Tag color='green'  >Optimo</Tag> : state == "Factible" ? <Tag color='blue'  >Factible </Tag> : <Tag color='volcano'  >No Factible</Tag>}</>)
        }


    ];
    const [messageApi, contextHolder] = message.useMessage();
    const success = (Mensaje) => {
        messageApi.open({
            type: 'success',
            content: Mensaje,
        });
    };

    const error = (Mensaje) => {
        messageApi.open({
            type: 'error',
            content: Mensaje,
        });
    };

    const abrirCerrarModal = () => {


        setModal(!modal);
    }

    const handleChange = (e, item) => {
        const { name, value, title } = e.target;
        let matrizActual = Matriz;
        console.log('D', matrizActual[name])
        if (title == "x") {
            console.log(matrizActual[name].x)
            matrizActual[name].x = value
        }
        else {
            if (title == "restriccion") {
                console.log(matrizActual[name].restriccion)
                matrizActual[name].restriccion = value
            } else {
                console.log(matrizActual[name].y)
                matrizActual[name].y = value
            }

        }

        console.log(name, value, title, item);
        console.log('Actual', matrizActual);

        console.log(Matriz);
    }

    const handleChangeSelectMaxiMini = (data) => {
        console.log('selected', { data });
        console.log('selected key', data.key);
        console.log('selected value', data.value);

        setFuncion({
            ...FuncionObj,
            maxi: data.value == 2 ? false : true
        })



    };
    const handleChangeGeneral = (e) => {
        const { name, value, title } = e.target;

        console.log(name, value, title);

        setFuncion({
            ...FuncionObj,
            [name]: value
        })

    }


    const handleChangeSelectRestriccion = (data, item) => {
        console.log('selected', { data });
        console.log('selected key', data.key);
        console.log('selected value', data.value);
        console.log('selected item', item);
        let matrizActual = Matriz;


        switch (data.key) {
            case "1":
                matrizActual[item.key].simbolo = "<";
                matrizActual[item.key].simbolo_id = 1;

                break;

            case "2":
                matrizActual[item.key].simbolo = "<=";
                matrizActual[item.key].simbolo_id = 2;

                break;

            case "3":
                matrizActual[item.key].simbolo = "=";
                matrizActual[item.key].simbolo_id = 3;
                break;

            case "4":
                matrizActual[item.key].simbolo = ">=";
                matrizActual[item.key].simbolo_id = 4;

                break;
            //  return restriccion;             
            case "5":
                matrizActual[item.key].simbolo = ">";
                matrizActual[item.key].simbolo_id = 5;

                break;


        }


        console.log('matrizActual', matrizActual)


    };
    function puntoEstaEnRegionFactible(punto, coeficientes, terminosIndependientes, tiposRestricciones) {
        for (let i = 0; i < terminosIndependientes.length; i++) {
            // console.log('punto',punto)
            // console.log('coeficientes',coeficientes)
            // console.log('terminosIndependientes',terminosIndependientes)
            // console.log('tiposRestricciones',tiposRestricciones)
            //   let resultado = coeficientes[i][0] * punto[0] + coeficientes[i][1] * punto[1];
            let resultado = punto[0] * coeficientes[i][0] + punto[1] * coeficientes[i][1];

            if (tiposRestricciones[i] === "<=" && resultado > terminosIndependientes[i]) {
                return false;
            }
            else if (tiposRestricciones[i] === ">=" && resultado < terminosIndependientes[i]) {
                return false;
            }
            else if (tiposRestricciones[i] === "=" && resultado !== terminosIndependientes[i]) {
                return false;
            }
        }
        return true;
    }

    const onFinish = (values) => {
  

        // metodoGraficoR(n2, funcionObjetivo2, A2, b2, maximizar, RestriccionSibolos2);

        // try {


        //     // console.log('Success:', values);



        //     console.log('MATRIZ ENVIADA', Matriz)
        //     console.log('FuncionObj ENVIADA', FuncionObj)

        //     let n2 = 2; // Número de restricciones
        //     let A2 = []; // Matriz de coeficientes de las restricciones
        //     let b2 = []; // Vector de términos independientes de las restricciones

        //     let ListaResticio = []; // Matriz de coeficientes de las restricciones

        //     let RestriccionSibolos2 = []; // Vector de términos independientes de las restricciones
        //     // let funcionObjetivo2 = (x, y) => 5 * x + 3 * y; // Función objetivo


        //     n2 = Matriz.length;

        //     for (let index = 0; index < Matriz.length; index++) {
        //         // const element = array[index];
        //         A2.push([Matriz[index].x, Matriz[index].y])
        //         ListaResticio.push(Matriz[index].x + 'x + ' + Matriz[index].y + 'y ' + Matriz[index].simbolo + ' ' + Matriz[index].restriccion)
        //         b2.push(Matriz[index].restriccion)
        //         RestriccionSibolos2.push(Matriz[index].simbolo)

        //     }
        //     // A2.push([1,0])
        //     // A2.push([0,1])
        //     // b2.push(0)
        //     // b2.push(0)
        //     // RestriccionSibolos2.push('>=')
        //     // RestriccionSibolos2.push('>=')
        //     // let coeficientes = [[1, 1], [9, 5]];
        //     // let terminosIndependientes = [6, 45];
        //     // let tiposRestricciones = ["<=", "<="];
        //     // // let { Todosvertices, vertices, valoresObjetivo, coordenadaOptima } = metodoGraficov2(coeficientes, terminosIndependientes, tiposRestricciones, funcionObjetivo3, objetivoMaximizar);
        //     // let { Todosvertices, vertices, valoresObjetivo, coordenadaOptima } = metodoGraficov2(A2, b2, RestriccionSibolos2, funcionObjetivo3, objetivoMaximizar);
        //     // let coeficientes2 = [[2, 1], [-1, 2], [1, -1]];
        //     // let terminosIndependientes2 = [8, 2, 4];
        //     // let tiposRestricciones2 = [">=", ">=", "<="];
        //     // let funcionObjetivo2 = [3, 5];
        //     // let objetivoMaximizar2 = true;
        //     // let resultado = metodoGraficov3(coeficientes2, terminosIndependientes2, tiposRestricciones2, funcionObjetivo2, objetivoMaximizar2);
        //     // console.log(resultado);

        //     let objetivoMaximizar = FuncionObj.maxi;
        //     let funcionObjetivo3 = [FuncionObj.x, FuncionObj.y];
        //     let funcionObjetivoTexto = (FuncionObj.maxi ? 'Max ' : 'Min ') + "" + FuncionObj.x + 'x + ' + FuncionObj.y + 'y'

        //     console.log('A2', A2)
        //     console.log('b2', b2)
        //     console.log('RestriccionSibolos2', RestriccionSibolos2)
        //     console.log('ListaResticio', ListaResticio)
        //     console.log('funcionObjetivoTexto', funcionObjetivoTexto)
        //     console.log('objetivoMaximizar', objetivoMaximizar)


        //     let resultado2 = metodoGraficov3(A2, b2, RestriccionSibolos2, funcionObjetivo3, objetivoMaximizar);
        //     let resultado3 = metodoGraficov3(A2, b2, RestriccionSibolos2, funcionObjetivo3, objetivoMaximizar);

        //     // console.log('resultado2', resultado2);
        //     // console.log('resultado3', resultado3);
        //     // console.log('resultado2.Todosvertices1', resultado2.Todosvertices);
        //     // console.log('resultado3.Todosvertices2', resultado3.Todosvertices);

        //     let listaPuntoFactibleV = resultado2.Todosvertices;

        //     let listaPuntoFactible = []
        //     let listaPuntoTexto = []
        //     for (let index = 0; index < resultado2.Todosvertices.length; index++) {
        //         listaPuntoFactible.push(puntoEstaEnRegionFactible(resultado2.Todosvertices[index], A2, b2, RestriccionSibolos2))
        //         if (!puntoEstaEnRegionFactible(resultado2.Todosvertices[index], A2, b2, RestriccionSibolos2)) {
        //             listaPuntoFactibleV.splice(index, 1);
        //         }

        //     }
        //     console.log('resultado2.Todosvertices2', resultado3.Todosvertices);

        //     for (let index = 0; index < resultado3.Todosvertices.length; index++) {
        //         // console.log('resultado2.Todosvertices[index][0]', resultado3.Todosvertices[index][0])
        //         // console.log('FuncionObj.x', FuncionObj.x)
        //         let calculo = parseFloat(FuncionObj.x) * parseFloat(resultado3.Todosvertices[index][0]) + parseFloat(FuncionObj.y) * parseFloat(resultado3.Todosvertices[index][1]);
        //         // console.log('calculo ', calculo)
        //         let texto = puntoEstaEnRegionFactible(resultado3.Todosvertices[index], A2, b2, RestriccionSibolos2) ? 'Factible' : 'No Factible';
        //         listaPuntoTexto.push({
        //             punto: index,
        //             coordenadas: `(${resultado3.Todosvertices[index][0]},${resultado3.Todosvertices[index][1]})`,
        //             funcionObjeto: ` ${FuncionObj.x}(${resultado3.Todosvertices[index][0]}) + ${FuncionObj.y}(${resultado3.Todosvertices[index][1]}) = ${calculo}`
        //             , optimo: texto
        //         })
        //     }
        //     listaPuntoTexto.push({
        //         punto: listaPuntoTexto.length,
        //         coordenadas: `(${resultado2.coordenadaOptima[0]},${resultado2.coordenadaOptima[1]})`,
        //         funcionObjeto: ` ${FuncionObj.x}(${resultado2.coordenadaOptima[0]}) + ${FuncionObj.y}(${resultado2.coordenadaOptima[1]}) = ${resultado2.valoresObjetivo[0]}`
        //         , optimo: 'Optimo'
        //     })

        //     console.log('Vertices Factibles', listaPuntoFactible)
        //     console.log(' listaPuntoTexto', listaPuntoTexto)
        //     console.log('Vertices listaPuntoFactibleV', listaPuntoFactibleV)
        //     listaPuntoFactibleV.push([resultado2.coordenadaOptima[0], resultado2.coordenadaOptima[1]])

        //     setTablaSolucion(listaPuntoTexto);
        //     setMatrizVertices(resultado3.Todosvertices);

        //     setFuncionObjTex(funcionObjetivoTexto)
        //     setRestriccionTex(ListaResticio)
        //     setMatrizVerticesFactible(listaPuntoFactibleV);


        //     setPuntoOptimo({
        //         x: resultado2.coordenadaOptima[0],
        //         y: resultado2.coordenadaOptima[1]
        //     })
        //     ////////////////////////////////////////////////////////////
        //     ////////////////////////////////////////////////////////////
        //     ////////////////////////////////////////////////////////////
        //     const app = window.ggbApplet;
        //     app.reset()
        //     // app.evalCommand('B=(2,0)');


        //     listaPuntoFactibleV.sort(compararCoordenadas);
        //     listaPuntoFactibleV.push(listaPuntoFactibleV[0])
        //     console.log('listaPuntoFactibleV ORDENADO', listaPuntoFactibleV)
        //     // app.evalCommand(`Optimo =(${funcionObjetivo.x},${funcionObjetivo.y})`);
        //     app.evalCommand(`Optimo =(${resultado2.coordenadaOptima[0]},${resultado2.coordenadaOptima[1]})`);
        //     let lista = ''
        //     for (let index = 0; index < listaPuntoFactibleV.length; index++) {
        //         // const element = array[index];
        //         lista = lista + `(${listaPuntoFactibleV[index][0]},${listaPuntoFactibleV[index][1]})`
        //     }
        //     for (let index = 0; index < resultado3.Todosvertices.length; index++) {
        //         // const element = array[index];
        //         app.evalCommand(`P${index}=(${resultado3.Todosvertices[index][0]},${resultado3.Todosvertices[index][1]})`);
        //         // console.log(`Line((${Puntos[index][0]},${Puntos[index][1]})),(${Puntos[index+1][0]},${Puntos[index+1][1]}))`)
        //         //lista = lista + `(${resultado3.Todosvertices[index][0]},${resultado3.Todosvertices[index][1]})`
        //     }
        //     const result = lista.replace(/\)\(/g, "),(");

        //     console.log(result); // (0,0),(6,0),(0,6),(5,0)
        //     console.log('lista Poligono', lista)

        //     app.evalCommand(`AreaFactible=Polygon(${result})`);

        //     let index2 = 0;
        //     for (let index = 1; index < resultado3.Todosvertices.length; index += 2) {

        //         // app.evalCommand(`${RestriccionTex[index2]}=Line((${Puntos[index][0]},${Puntos[index][1]}),(${Puntos[index + 1][0]},${Puntos[index + 1][1]}))`);
        //         app.evalCommand(`Resticcion${index2 + 1}=Line((${resultado3.Todosvertices[index][0]},${resultado3.Todosvertices[index][1]}),(${resultado3.Todosvertices[index + 1][0]},${resultado3.Todosvertices[index + 1][1]}))`);
        //         index2++;
        //     }
        //     console.log('lista MatrizVerticesFactible', MatrizVerticesFactible)

        //     if (resultado2.valoresObjetivo[0] === 0) {
        //         error('No se encontro una soluccion Optima')
        //         setMostarResul(true)

        //         app.reset()

        //     } else {

        //         success('Se ha calculado Sactifactoriamente')
        //         setMostarResul(!MostarResul)


        //         abrirCerrarModal();

        //     }

        //     // const data = [
        //     //     { id: 1, name: 'John', age: 25 },
        //     //     { id: 2, name: 'Jane', age: 30 },
        //     //     { id: 3, name: 'Bob', age: 35 },
        //     // ];
        //     // const tableHtml = `<table><thead><tr><th>Nombre</th><th>Edad</th></tr></thead><tbody>${tableRows.join('')}</tbody></table>`;

        //     // const newWindow = window.open('', '', 'width=400,height=300');
        //     // newWindow.document.write(tableHtml);

        // } catch (error) {
        //     error('Se presento un Error');
        // }


    };
    function compararCoordenadas(a, b) {
        if (a[0] < b[0]) {
            return -1;
        } else if (a[0] > b[0]) {
            return 1;
        } else {
            if (a[1] < b[1]) {
                return -1;
            } else if (a[1] > b[1]) {
                return 1;
            } else {
                return 0;
            }
        }
    }


    const onRest = () => {
        console.log('Success:');

        let matrizActual = Matriz;

        console.log('Matriz length', Matriz.length)



        matrizActual.pop();

        setMatriz(matrizActual)


        console.log('matrizActual', matrizActual)
        console.log('Matriz nueva', Matriz)

        success('Se Elimino una Restricción')

    };


    const onAdd = () => {

        console.log('Success:');

        let matrizActual = Matriz;

        console.log('Matriz length', Matriz.length)


        matrizActual.push({
            key: Matriz.length,
            x: null,
            y: null,
            simbolo: "<",
            simbolo_id: 1,
            restriccion: null
        })

        setMatriz(matrizActual)

        console.log('matrizActual', matrizActual)
        console.log('Matriz nueva', Matriz)
        // console.log(Matriz.length) 
        //    console.log('MATRIZ ENVIADA',Matriz)
        success('Se agrego una Restricción')

    };


    const [componentSize, setComponentSize] = useState('default');
    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };
    return (
        // <div justify="center"  >
        //     <Layout>
        //         <Header >Header</Header>
        //         <Content >    <Form
        //         style={{
        //             padding: 24,
        //             textAlign: 'center',
        //             // background: colorBgContainer,
        //           }}
        //         labelCol={{
        //             span: 4,
        //         }}
        //         wrapperCol={{
        //             span: 14,
        //         }}
        //         layout="horizontal"
        //         initialValues={{
        //             size: 'Default',
        //         }}
        //         onValuesChange={onFormLayoutChange}
        //         size='Default'
        //         style={{
        //             maxWidth: 600,
        //         }}
        //     >

        //         <Form.Item label="Input">
        //             <Input />
        //         </Form.Item>
        //         <Form.Item label="Select">
        //             <Select>
        //                 <Select.Option value="demo">Demo</Select.Option>
        //             </Select>
        //         </Form.Item>

        //         <Form.Item label="Button">
        //             <Button>Button</Button>
        //         </Form.Item>
        //     </Form></Content>
        //         <Footer >Footer</Footer>
        //       </Layout>
        
        // </div>

        <div justify="center"  >

        <br />
        <br />
        {contextHolder}
        <br />

        <Row justify="center">

            <Col span={4}>

                <Item  >
                    <Select
                        showSearch
                        labelInValue
                        name="o_id"

                        // value={item && item.simbolo}
                        style={{
                            width: '100%',
                        }}
                        onChange={(e) => handleChangeSelectMaxiMini(e)}
                    // onSearch={onSearch}
                    >
                        {
                            InitialMaxiMini.map((item1) => (
                                // <Option key={item.origin} value={item.nameSimbolo}> {item.nameSimbolo}</Option>
                                <Option key={item1.id} value={item1.key}> {item1.nameSimbolo}</Option>
                            ))
                        }
                    </Select>
                </Item>
            </Col>


        </Row>




        <Row justify="center">
            <Col span={4}>
                <Item label="FUNCION OBJETIVO" >
                    {/* <Input name='x' onChange={handleChange} /> */}
                </Item>

            </Col>
            <Col span={4}>
                <Item label="x" >
                    <Input name='x' onChange={handleChangeGeneral} />
                </Item>

            </Col>
            <Col span={4}>

                <Item label="y">
                    <Input name='y' onChange={handleChangeGeneral} />
                </Item>
            </Col>

        </Row>



        {Matriz.map(item => (

            <>
                <Row >
                    <Col span={12}   >
                        Restriccion {item.key + 1}

                    </Col>

                </Row>
                <Row justify="center">
                    <Col span={4} >
                        <Item label="x" key={item.key}  >
                            <Input name={item.key} key={item.key} title={'x'} values={item & item.x} onChange={(e) => handleChange(e, item)} />
                        </Item>
                    </Col>
                    <Col span={4} key={item.key}>
                        <Item label="+ y " key={item.key}>
                            <Input name={item.key} key={item.key} title={'y'} values={item & item.y} onChange={(e) => handleChange(e, item)} />
                        </Item>
                    </Col>
                    <Col span={2}>
                        <Item  >
                            <Select
                                showSearch
                                labelInValue
                                name="o_id"
                                key={item.key}
                                // value={item && item.simbolo}
                                style={{
                                    width: '90%',
                                }}
                                onChange={(e) => handleChangeSelectRestriccion(e, item)}
                            // onSearch={onSearch}
                            >
                                {
                                    Simbolo.map((item1) => (
                                        // <Option key={item.origin} value={item.nameSimbolo}> {item.nameSimbolo}</Option>
                                        <Option key={item1.id} title={item.key} value={item1.key}> {item1.nameSimbolo}</Option>
                                    ))
                                }
                            </Select>
                        </Item>
                    </Col>
                    <Col span={4}>
                        <Item >
                            <Input name={item.key} key={item.key} title={'restriccion'} values={item & item.restriccion} onChange={(e) => handleChange(e, item)} />
                        </Item>

                    </Col>
                </Row>
            </>
        ))}



        {/* <Button type="primary" htmlType="submit">
                    Submit
                </Button> */}

        <Button type="primary" onClick={onFinish}>
            Resolver
        </Button>

        <Button type="primary" onClick={onAdd}>
            Adicionar
        </Button>

        <Button type="primary" disabled={Matriz.length > 2 ? false : true} onClick={onRest}>
            Quitar
        </Button>
        {/* </Form> */}
        {/* <h1>Calculadoraaaa</h1> */}


        <br />





        <br/>
        {/* <div hidden={MostarResul}>
            <Table dataSource={TablaSolucion} columns={columns} />

        </div> */}



    </div>


    );


}

export { FromDeterministico };
