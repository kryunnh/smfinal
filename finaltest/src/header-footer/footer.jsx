import './footer.css';
import Rabbit from '../assets/rabbit.png'


export default function Footer(){
    return (
        <footer className='footer'>
          <div className="logo">
            <h1>냠<img src={Rabbit}/>냠</h1>
          </div>
          <div>
          <p>이 프로젝트는 포트폴리오 목적으로 제작되었습니다. 상업적인 용도로 사용하지 않을 것이며, 기존 사이트( )에서 자료를 가져와 활용하였습니다. 이 프로젝트의 목적은 개인적인 학습과 기술 데모를 위한 것입니다. 원작자가 아닌 다른 소스로부터 자료를 가져왔음을 밝힙니다.</p>
          <p>© 2025 레시피 사이트. All rights reserved.</p>
          </div>
        </footer>
      );
}