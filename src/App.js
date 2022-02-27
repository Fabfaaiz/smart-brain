import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation.js';
import Logo from './Components/Logo/Logo.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import ImagelinkForm from './Components/ImagelinkForm/ImagelinkForm.js'
import Rank from './Components/Rank/Rank.js'
import Clarifai from 'clarifai';
import Particles from "react-tsparticles";
import SignIn from './Components/SignIn/SignIn.js';
import Register from './Components/Register/Register.js'
import './App.css';

const app = new Clarifai.App({
  apiKey: '714e867b0bf54c94a0b8c30e631fb42c'
});

const particlesOption= {
  particles: {
    number: {
      value:100,
      density: {
        enable: true,
        value_area: 700
      },
    },
    size: {
      random: true,
      value: 3,
    },
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
 }
 loadUser = (data) =>{
   this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      enteries: data.enteries,
      joined: data.joined
   }})
 }

 componentDidMount(){
   fetch('https://lit-depths-97433.herokuapp.com')
    .then(response=>response.json())
    .then(data=>console.log(data));
 }

  calculateFaceLocation = (data) => {
    const clarifai = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    console.log(image);
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifai.left_col * width,
      topRow: clarifai.top_row * height,
      rightCol: width - (clarifai.right_col*width),
      bottomRow: height - (clarifai.bottom_row * height),
    }
  }
  
  displayFaceBox =(box) => {
    this.setState({box:box});
    console.log(box);
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    console.log(this.state.user);
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
         )
      .then(response=>{ 
        if(response.outputs[0].data.regions){
          console.log(response.outputs[0].data);
            fetch('https://lit-depths-97433.herokuapp.com/image',{
              method:'put',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count=>{
              this.setState(Object.assign(this.state.user, { enteries: count}))
            })
            this.displayFaceBox(this.calculateFaceLocation(response))
        }else{
          console.log("Invalid Face");
        }
      })
      .catch(err => console.log(err))
  }

  onRouteChange =(route) =>{
    if(route==='signout'){
      this.setState({isSignnedIn:false})
    }
    else if(route==='home'){
      this.setState({isSignnedIn:true})
    }
    this.setState({route:route});
  }

  render() {
    return (
      <div className="App">
          <Particles className="particles" 
          params={particlesOption}
          />
          <Navigation isSignnedIn={this.state.isSignnedIn} onRouteChange={this.onRouteChange}/>
          {this.state.route ==='home'
            ?<div>
            <Logo />
            <Rank name={this.state.user.name} enteries={this.state.user.enteries}/>
            <ImagelinkForm  
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} />

            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
            :(this.state.route==='signin'
            ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
          }
      </div>
    );
  }
}
export default App;
