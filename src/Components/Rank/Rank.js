import React from 'react';
const Rank = ({name,enteries}) => {
    return(
        <div>
            <div className='white f3'>
               {`${name},Your current entry count is ....`}
            </div>
            <div className='white f3'>
               {`${enteries}`}
            </div> 
        </div>
    )
}
export default Rank;