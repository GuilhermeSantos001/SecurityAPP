/**
 * Import React
 */
import React from "react";

/**
 * Import Bootstrap
 */
import {
  Container,
  Badge,
  Image,
  ButtonToolbar,
  Button
} from 'react-bootstrap';

/**
 * Import CanvasJSReact
 */
import CanvasJSReact from './assets/canvasjs.react';

/**
 * Import Services
 */
import productService from './services/productService';

/**
 * Import Resources from Page
 */
import logo from './logo.svg';
import 'animate.css';
import './css/App.css';

/**
 * Import Icons
 */
import {
  MdPeople,
  MdAnnouncement,
  MdDashboard,
  MdRssFeed,
  MdLiveHelp,
  MdVerifiedUser,
  MdMood,
  MdMoodBad,
  MdDateRange,
  MdUpdate,
  MdHdrWeak,
  MdError
} from 'react-icons/md';

/**
 * Import React PDF
 */
import MyPDF from './components/RenderPDF';

/**
 * Import Menu App
 */
import AppMenu from './components/AppMenu';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: 'dashboard'
    }
  }

  render() {
    return (
      <div className="App">
        <Container fluid={true}>
          <AppMenu menu={this.state.menu} />
        </Container>
      </div>
    )
  }
}

// function App() {
//   const [products, setproducts] = useState(null);
//   const [clock, setclock] = useState(null);
//   const [menuactive, setmenuactive] = useState('dashboard');
//   var CanvasJSChart = CanvasJSReact.CanvasJSChart;

//   useEffect(() => {
//     if (!products) {
//       getProducts();
//     }

//     window.setInterval(function () {
//       getClock();
//     }, 1000);
//   });

//   const animateCSS = (element, animationName, callback) => {
//     const node = document.querySelector(element);
//     if (node) {
//       node.classList.add('animated', animationName);

//       let handleAnimationEnd = () => {
//         node.classList.remove('animated', animationName);
//         node.removeEventListener('animationend', handleAnimationEnd);

//         if (typeof callback === 'function') callback()
//       }

//       node.addEventListener('animationend', handleAnimationEnd);
//     }
//   }

//   const getProducts = async () => {
//     let res = await productService.getAll();
//     setproducts(res);
//   }

//   const getClock = () => {
//     console.log(menuactive);
//     if (menuIsActive('dashboard') != 'active') return;
//     let res = `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear())} - \n\r\
//     ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
//     setclock(res);
//   }

//   const menuIsActive = menu => {
//     return menuactive === menu ? 'active' : '';
//   }

//   const renderProduct = product => {
//     return (
//       <li key={product._id} className="list__item product">
//         <h1 className="product__name">
//           {product.name} <Badge variant="secondary">Novo!</Badge>
//         </h1>
//         <p className="product__description">{product.description}</p>
//       </li>
//     );
//   };

//   const renderButton = button => {
//     switch (button.id) {
//       default:
//         break;
//       case '1':
//         return (
//           <Button
//             id="_dashboard"
//             className={"m-2 " + menuIsActive('dashboard')}
//             variant="outline-info"
//             size="lg"
//             block
//             onClick={() => setmenuactive('dashboard')}
//           >
//             <MdDashboard /> {button.text}
//           </Button>
//         )
//       case '2':
//         return (
//           <Button
//             id="_clients"
//             className={"m-2 " + menuIsActive('clients')}
//             variant="outline-info"
//             size="lg"
//             block
//             onClick={() => setmenuactive('clients')}
//           >
//             <MdPeople /> {button.text}
//           </Button>
//         )
//       case '3':
//         return (
//           <Button
//             id="_suport"
//             className={"m-2 " + menuIsActive('suport')}
//             variant="outline-info"
//             size="lg"
//             block
//             onClick={() => setmenuactive('suport')}
//           >
//             <MdAnnouncement /> {button.text}
//           </Button>
//         )
//     }
//   };

//   const renderContent = () => {
//     if (menuIsActive('dashboard') === 'active') {
//       return (
//         <div className='Dashboard-Container'>
//           <div className="Dashboard-view_1">
//             <div className="row">
//               <div className="bg-success col-3 ml-2">
//                 <h1><MdRssFeed /> Postos Cobertos</h1>
//                 <h2>{Math.floor(1 + Math.random() * 100)}</h2>
//               </div>
//               <div className="bg-danger col-3">
//                 <h1><MdRssFeed /> Postos Descobertos</h1>
//                 <h2>{Math.floor(1 + Math.random() * 100)}</h2>
//               </div>
//               <div className="bg-info col-5 ml-5">
//                 <h1><MdDateRange /> Data e Horario</h1>
//                 <h2>{clock}</h2>
//               </div>
//             </div>
//             <div className="row">
//               <div className="bg-white border-top border-dark col-3 ml-2 pt-2">
//                 <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 'calc(10px + 1vmin)' }}><MdVerifiedUser /> Clientes Importantes Cobertos</p>
//                 <ul className="list-group">
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-8px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
//                     <MdMood /> Forest Park
//                   </li>
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
//                     <MdMood /> Pão de Açucar
//                   </li>
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
//                     <MdMood /> Açai Atacadista
//                   </li>
//                 </ul>
//               </div>
//               <div className="bg-white border-top border-dark col-3 pt-2">
//                 <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 'calc(10px + 1vmin)' }}><MdError /> Clientes Importantes Descobertos</p>
//                 <ul className="list-group">
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-8px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
//                     <MdMoodBad /> Condominio Renascimento
//                   </li>
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
//                     <MdMoodBad /> Villa Amalfi
//                   </li>
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
//                     <MdMoodBad /> Condominio Jaguare
//                   </li>
//                 </ul>
//               </div>
//               <div className="bg-white border-top border-dark col-5 ml-5 pt-2">
//                 <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 'calc(10px + 1vmin)' }}><MdUpdate /> Suas ultimas atualizações</p>
//                 <ul className="list-group">
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-8px + -2vmin)' }}>
//                     <MdHdrWeak /> Confirmação de cobertura de posto no Forest Park <span className="badge badge-info font-weight-bold" style={{ 'fontSize': 'calc(2.5px + 1vmin)' }}>23/05/2020</span>
//                   </li>
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)' }}>
//                     <MdHdrWeak /> Alteração cadastral de posto no Villa Amalfi <span className="badge badge-info font-weight-bold" style={{ 'fontSize': 'calc(2.5px + 1vmin)' }}>19/05/2020</span>
//                   </li>
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-2px + -2vmin)' }}>
//                     <MdHdrWeak /> Cadastro de um novo vigilante no posto do Villa Amalfi <span className="badge badge-info font-weight-bold" style={{ 'fontSize': 'calc(2.5px + 1vmin)' }}>19/05/2020</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <div className="Dashboard-view_2">
//             <div>
//               {renderGraphics()}
//             </div>
//           </div>
//         </div>
//       )
//     } else if (menuIsActive('clients') === 'active') {
//       return (
//         <div className="Clients-Container">
//           <p>TESTE 2</p>
//         </div>
//       )
//     } else if (menuIsActive('suport') === 'active') {
//       return (
//         <div className="Suport-Container">
//           <div className="Suport-view_1">
//             <div className="row">
//               <div className="bg-secondary col-3 ml-3 mt-4">
//                 <h1><MdLiveHelp /> Precisa de ajuda?</h1>
//               </div>
//             </div>
//             <div className="row">
//               <div className="bg-white border-top border-dark col-3 ml-3 pt-2">
//                 <p className="text-dark text-left font-weight-bold" style={{ 'fontSize': 'calc(10px + 1vmin)' }}><MdVerifiedUser /> Clientes Importantes Cobertos</p>
//                 <ul className="list-group">
//                   <li className="list-group-item border-0 bg-transparent" style={{ 'fontSize': 'calc(6px + 1vmin)', 'marginTop': 'calc(-8px + -2vmin)', 'marginLeft': 'calc(-1px + -1vmin)' }}>
//                     <MdMood /> Forest Park
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//     }
//   }

//   const getRandomColor = () => {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }

//   const renderGraphics = () => {
//     const options = [
//       {
//         title: {
//           text: "Postos Cobertos",
//           fontSize: 42,
//           padding: {
//             top: 10
//           }
//         },
//         axisY: {
//           margin: 10
//         },
//         theme: "light2",
//         animationEnabled: true,
//         toolTip: {
//           content: "{name} foi/foram coberto(s) {y} posto(s)"
//         },
//         data: [
//           {
//             name: "Ano de 2020",
//             showInLegend: true,
//             type: "column",
//             color: getRandomColor(),
//             dataPoints: [
//               { label: "Domingo", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Segunda-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Terça-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Quarta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Quinta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Sexta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Sabado", y: Math.floor(1 + Math.random() * 100) }
//             ]
//           },
//           {
//             name: "Ano de 2021",
//             showInLegend: true,
//             type: "column",
//             color: getRandomColor(),
//             dataPoints: [
//               { label: "Domingo", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Segunda-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Terça-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Quarta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Quinta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Sexta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Sabado", y: Math.floor(1 + Math.random() * 100) }
//             ]
//           }
//         ]
//       },
//       {
//         title: {
//           text: "Postos Descobertos",
//           fontSize: 42,
//           padding: {
//             top: 10
//           }
//         },
//         axisY: {
//           margin: 10
//         },
//         theme: "light2",
//         animationEnabled: true,
//         toolTip: {
//           content: "{name} não foi/foram coberto(s) {y} posto(s)"
//         },
//         data: [
//           {
//             name: "Ano de 2020",
//             showInLegend: true,
//             type: "column",
//             color: getRandomColor(),
//             dataPoints: [
//               { label: "Domingo", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Segunda-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Terça-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Quarta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Quinta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Sexta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Sabado", y: Math.floor(1 + Math.random() * 100) }
//             ]
//           },
//           {
//             name: "Ano de 2021",
//             showInLegend: true,
//             type: "column",
//             color: getRandomColor(),
//             dataPoints: [
//               { label: "Domingo", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Segunda-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Terça-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Quarta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Quinta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Sexta-Feira", y: Math.floor(1 + Math.random() * 100) },
//               { label: "Sabado", y: Math.floor(1 + Math.random() * 100) }
//             ]
//           }
//         ]
//       }
//     ]

//     return (
//       <div>
//         <div className="row">
//           <div className="col-6 mt-2 bg-transparent" style={{ 'marginLeft': 'calc(0.1px + 0.5vmin)' }}>
//             <CanvasJSChart
//               options={options[0]}
//             // onRef={ref => this.chart = ref}
//             />
//             <p>{MyPDF.printNow()}</p>
//           </div>
//           <div className="col-6 mt-2 bg-transparent" style={{ 'marginLeft': 'calc(-8px + -1vmin)' }}>
//             <CanvasJSChart
//               options={options[1]}
//             // onRef={ref => this.chart = ref}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Container fluid={true}>
//       <div className="App">
//         <div className="row">
//           <div className="col-2 bg-dark">
//             <Image className="App-logo" src={logo} />
//             <h1 className="App-Title">Grupo Mave</h1>
//             <div className="App-header">
//               <ButtonToolbar>
//                 {renderButton({ id: "1", text: 'Dashboard' })}
//                 {renderButton({ id: "2", text: 'Clientes' })}
//                 {renderButton({ id: "3", text: 'Suporte' })}
//               </ButtonToolbar>
//             </div>
//           </div>
//           <div className="col-10 bg-light">
//             {renderContent()}
//           </div>
//         </div>
//         {/* <ul className="list">
//           {(products && products.length > 0) ? (
//             products.map(product => renderProduct(product))
//           ) : (
//               <p>No products found</p>
//             )}
//         </ul> */}
//       </div>
//     </Container>
//   );
// }
// 
// export default App;