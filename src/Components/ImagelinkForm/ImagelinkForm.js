import React from 'react';
import './ImagelinkForm.css';
const ImagelinkForm = ({onInputChange,onButtonSubmit}) => {
    return(
        <div>
          <p className='f3'>
              {'Give Your image url and detect the face'}
          </p> 
          <div className='center'>
              <div className='form center pa4 br3 shadow-3'>
                <input className='f4 pa2 w-70 center' type='tex' onChange={onInputChange}/>
                <button className='w-30 grow f4 link ph3 pv2 white bg-purple' onClick={onButtonSubmit}>Detect</button>
              </div>
          </div>
        </div>
    )
}
export default ImagelinkForm;