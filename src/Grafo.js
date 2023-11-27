import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Input, Form, Row, Select, message, Divider, Col, Tag, Layout, Tabs } from "antd";
import { Menu } from 'antd';
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import dijkstra from 'dijkstrajs';

function GraphVisualization() {
  const { TabPane } = Tabs;
  const graph = {
    nodes: [
      { id: 1, label: "Start" },
      { id: 2, label: "A", },
      { id: 3, label: "B", },
      { id: 4, label: "C", },
      { id: 5, label: "D", },
      { id: 6, label: "Finish", }
    ],
    edges: [
      { from: 1, to: 2, title: "Edge Start to A tooltip text", label: "5" },
      { from: 1, to: 3, title: "Edge Start to B tooltip text", label: "2" },
      { from: 2, to: 4, title: "Edge A to C tooltip text", label: "4" },
      { from: 2, to: 5, title: "Edge A to D tooltip text", label: "2" },
      { from: 3, to: 2, title: "Edge B to A tooltip text", label: "8" },
      { from: 3, to: 5, title: "Edge B to D tooltip text", label: "7" },
      { from: 4, to: 5, title: "Edge C to D tooltip text", label: "6" },
      { from: 4, to: 6, title: "Edge C to Finish tooltip text", label: "3" },
      { from: 5, to: 6, title: "Edge D to Finish tooltip text", label: "1" },
      //   { from: 2, to: 7, title: "Edge 2 to 7 tooltip text" }
    ]
  };
  const { Option } = Select;
  const { Item } = Form;

  const layout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 18
    }
  };
  const initailForm = {
    grafos: 2,
    relaciones: 2
  };
  const [messageApi, contextHolder] = message.useMessage();
  const success = (Mensaje) => {
    messageApi.open({
      type: 'success',
      content: Mensaje,
    });
  };

  const onClickPost = () => {
    console.log('entro post', fromData)
    console.log('entro post', Matriz)

    // Crear un grafo dirigido
    const grafoDirigido = {};
    for (const enlace of Matriz) {
      const { origen, destino, peso } = enlace;
      if (!grafoDirigido[origen]) {
        grafoDirigido[origen] = {};
      }
      grafoDirigido[origen][destino] = parseInt(peso, 10);
    }
    // const rutaMasCorta = dijkstra.find_path(grafoDirigido, "0", "90");
    // console.log("Ruta más corta:", rutaMasCorta);
     console.log("grafoDirigido:", grafoDirigido); 

    const {rutaMasLarga , pesoTotalLarga } = bellmanFordLarga(Matriz, "0", "90");
    const {rutaMasCorta , pesoTotalCorta } = bellmanFordCorta(Matriz, "0", "90");
    console.log("Ruta más larga:", rutaMasLarga);
    console.log("Ruta más pesoTotalLarga:", pesoTotalLarga);
    console.log("Ruta más corta:", rutaMasCorta);
    console.log("Ruta más pesoTotalCorta:", pesoTotalCorta);

    let rutaLargaSimbolo={}
    for (let index = 0; index < rutaMasLarga.length; index++) {      
      for (let index2 = 0; index2 < Simbolo.length; index2++) {
        if (rutaMasLarga[index]==Simbolo[index2].id) {
          rutaLargaSimbolo.push(Simbolo[index2].nameSimbolo)
        }        
      }      
    }
    let rutaCortaSimbolo={}
    for (let index = 0; index < pesoTotalCorta.length; index++) {      
      for (let index2 = 0; index2 < Simbolo.length; index2++) {
        if (rutaMasLarga[index]==Simbolo[index2].id) {
          rutaCortaSimbolo.push(Simbolo[index2].nameSimbolo)
        }        
      }      
    }

    console.log("Ruta más rutaCortaSimbolo:",rutaCortaSimbolo) 
    console.log("Ruta más rutaLargaSimbolo:",rutaLargaSimbolo)
    console.log("Ruta más corta:",Simbolo)

    //createData(fromData)
    // abrirCerrarModalInsertar();
    success('Se Registro Correctamente')
  }







  // Encontrar la ruta más larga con Bellman-Ford
  function bellmanFordLarga(grafo, inicio, fin) {
    const distancias = {};
    const predecesores = {};
    const vertices = new Set();
    const pesosTotales = {};

    for (const enlace of grafo) {
      const { origen, destino, peso } = enlace;
      vertices.add(origen);
      vertices.add(destino);
      distancias[origen] = -Infinity; // Cambiar a -Infinity para encontrar la ruta más larga
      distancias[destino] = -Infinity;
      predecesores[origen] = null;
      predecesores[destino] = null;
      pesosTotales[origen] = 0;
      pesosTotales[destino] = 0;
    }

    distancias[inicio] = 0;

    for (let i = 0; i < vertices.size - 1; i++) {
      for (const enlace of grafo) {
        const { origen, destino, peso } = enlace;
        if (distancias[origen] + parseInt(peso, 10) > distancias[destino]) {
          distancias[destino] = distancias[origen] + parseInt(peso, 10);
          predecesores[destino] = origen;
          pesosTotales[destino] = pesosTotales[origen] + parseInt(peso, 10);
        }
      }
    }

    const rutaMasLarga = [];
    let actual = fin;
    while (actual !== null) {
      rutaMasLarga.unshift(actual);
      actual = predecesores[actual];
    }
    console.log('pesosTotales[fin]',pesosTotales[fin])
    return {rutaMasLarga, pesoTotalLarga: pesosTotales[fin] } ;
  }

  // Encontrar la ruta más corta con Bellman-Ford
  function bellmanFordCorta(grafo, inicio, fin) {
    const distancias = {};
    const predecesores = {};
    const vertices = new Set();
    const pesosTotales = {};

    for (const enlace of grafo) {
      const { origen, destino, peso } = enlace;
      vertices.add(origen);
      vertices.add(destino);
      distancias[origen] = Infinity;
      distancias[destino] = Infinity;
      predecesores[origen] = null;
      predecesores[destino] = null;
      pesosTotales[origen] = 0;
      pesosTotales[destino] = 0;
    }

    distancias[inicio] = 0;

    for (let i = 0; i < vertices.size - 1; i++) {
      for (const enlace of grafo) {
        const { origen, destino, peso } = enlace;
        if (distancias[origen] + parseInt(peso, 10) < distancias[destino]) {
          distancias[destino] = distancias[origen] + parseInt(peso, 10);
          predecesores[destino] = origen;
          pesosTotales[destino] = pesosTotales[origen] + parseInt(peso, 10);
        }
      }
    }

    const rutaMasCorta = [];
    let actual = fin;
    while (actual !== null) {
      rutaMasCorta.unshift(actual);
      actual = predecesores[actual];
    }

    return { rutaMasCorta, pesoTotalCorta: pesosTotales[fin] };
  }






  const InitialSimboloRestricciones = [
    {
      "id": 2,
      "nameSimbolo": "<=",
    }
    ,
    {
      "id": 3,
      "nameSimbolo": "=",
    }
    ,
    {
      "id": 4,
      "nameSimbolo": ">=",
    }
  ];


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

  const [Simbolo, setSimbolo] = useState(InitialSimboloRestricciones);
  const [Matriz, setMatriz] = useState(InitialMatriz);

  const [modalInsertar, setModalInsertar] = useState(true);
  const [fromData, setFormData] = useState(initailForm);
  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }
  // const options = {
  //     layout: {
  //         // hierarchical: true
  //     },
  //     edges: {
  //         color: "#000000"
  //     },
  //     height: "1000px"
  // };
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...fromData,
      [name]: value
    });
    // console.log(fromData);
  }
  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#1D1D1D',
    },
    height: "1000px",
    interaction: {
      //   hover: true,
      navigationButtons: true,
      //   tooltipDelay: 0,
    },
    nodes: {
      borderWidth: 0,
      borderWidthSelected: 0,
      color: '#0262C4',
      shape: 'circle',
      size: 1,
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.5)',
        size: 25,
        x: 5,
        y: 5,
      },
      font: {
        color: '#fff',
        size: 25,
        bold: {
          mod: 'bold',
        },
      },
    },
  };

  const onChangeTab = (key) => {
    console.log('fron data', fromData)
    console.log(key);
    const nuevoArrayIndependiente = []
    // Convertir a un array con "start, A, B, C, D, F, G, H, hasta Z y finish"
    const simbolosNuevos = ["Start"];
    nuevoArrayIndependiente.push({
      id: 0,
      nameSimbolo: 'Start'
    });
    console.log('data', 64 + parseInt(fromData.grafos))
    for (let i = 65; i <= 62 + parseInt(fromData.grafos); i++) {
      simbolosNuevos.push(String.fromCharCode(i));
      nuevoArrayIndependiente.push({
        id: i,
        nameSimbolo: String.fromCharCode(i)
      });
    }
    nuevoArrayIndependiente.push({
      id: 90,
      nameSimbolo: 'Finish'
    });
    simbolosNuevos.push("Finish");
    setSimbolo(nuevoArrayIndependiente)
    let matrizActual = [];
    for (let index = 0; index < parseInt(fromData.relaciones); index++) {
      matrizActual.push({
        key: index,
        origen: null,
        origenSimbolo: null,
        destino: null,
        destinoSimbolo: null,
        peso: 0
      })

    }

    setMatriz(matrizActual)


    console.log("Nuevo array con simbolos:", simbolosNuevos);
    console.log("Nuevo array con nuevoArrayIndependiente:", nuevoArrayIndependiente);


    // InitialSimboloRestricciones
  };

  const handleChangeSelectOrigen = (data, item) => {
    console.log('selected handleChangeSelectOrigen', { data });
    console.log('selected key', data.key);
    console.log('selected value', data.value);
    console.log('selected data.label[1]', data.label[1]);
    console.log('selected item', item);
    let matrizActual = Matriz;
    matrizActual[item.key].origen = data.key;
    matrizActual[item.key].origenSimbolo = data.label[1];
    console.log('matrizActual', matrizActual)
  };

  const handleChangeSelectDestino = (data, item) => {
    console.log('selected handleChangeSelectDestino', { data });
    console.log('selected key', data.key);
    console.log('selected value', data.value);
    console.log('selected data.label[1]', data.label[1]);
    console.log('selected item', item);
    let matrizActual = Matriz;
    matrizActual[item.key].destino = data.key;
    matrizActual[item.key].destinoSimbolo = data.label[1];
    console.log('matrizActual', matrizActual)
  };




  const handleChangeMatrix = (e, item) => {
    const { name, value, title } = e.target;
    let matrizActual = Matriz;
    console.log('Matriz Actual', matrizActual[name])


    if (title == "peso") {
      console.log(matrizActual[name].restriccion)
      matrizActual[name].peso = value

    }

    console.log(name, value, title, item);
    console.log('Actual', matrizActual);

    console.log(Matriz);
  }

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    }
  };
  return (
    <>

      <Modal
        visible={modalInsertar}
        title="Ingresar Grafos"
        destroyOnClose={true}
        // style={{ height: "80vh"}}
        // style={{ width: "80vh"}}
        width={500}
        onCancel={abrirCerrarModalInsertar}
        centered
        footer={[
          // <Button onClick={abrirCerrarModalInsertar}>Cancelar</Button>,
          // <Button type="primary" onClick={peticionPost}>Insertar</Button>,
          <Button type="primary" onClick={onClickPost}>Generar Grafo</Button>,

        ]}
      >
        <Tabs defaultActiveKey="1" onChange={onChangeTab}>

          <TabPane tab="Paso 1" key="1">



            <Form
              {...layout}
            >

              <Row gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}>
                <Col
                  span={24}                >
                  <Form.Item
                    label="Cantidad de Grafos" >
                    <Input name="grafos" onChange={handleChange} />
                  </Form.Item>
                  <Form.Item
                    label="Cantidad de Relaciones"                  >
                    <Input name="relaciones" onChange={handleChange} />
                  </Form.Item>
                </Col>

              </Row>
            </Form>




          </TabPane>
          <TabPane tab="Paso 2" key="2">
            <Form
            // {...layout}
            >

              <Row gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}>
                <Col
                  span={24} >

                  <Form.Item
                    label="Restricciones movilidad"
                  >
                    <Input name="mobility_restric" onChange={handleChange} value={fromData && fromData.mobility_restric} />
                  </Form.Item>




                  {Matriz.map(item => (

                    <>

                      <Row justify="center">
                        <Col span={8}>
                          <Item label="Origen" key={item.key} >
                            <Select
                              showSearch
                              labelInValue
                              name="o_id"
                              key={item.key}
                              // value={item && item.simbolo}
                              style={{
                                width: '90%',
                              }}
                              onChange={(e) => handleChangeSelectOrigen(e, item)}
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


                        <Col span={8}>
                          <Item label="Destino" key={item.key} >
                            <Select
                              showSearch
                              labelInValue
                              name="o_id"
                              key={item.key}
                              // value={item && item.simbolo}
                              style={{
                                width: '90%',
                              }}
                              onChange={(e) => handleChangeSelectDestino(e, item)}
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
                        <Col span={6}>
                          <Item label="Peso" key={item.key}>
                            <Input name={item.key} key={item.key} title={'peso'} values={item & item.peso} onChange={(e) => handleChangeMatrix(e, item)} />
                          </Item>

                        </Col>
                      </Row>
                    </>
                  ))}





                </Col>





              </Row>



            </Form>
          </TabPane>


        </Tabs>








      </Modal>



      {!modalInsertar && <Graph
        graph={graph}
        options={options}
        events={events}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
      }

    </>

  );


}

export { GraphVisualization };
