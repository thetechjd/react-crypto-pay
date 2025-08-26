const IncreaseButton = ({ setCount }:any) => {
    return (
      <button onClick={() => setCount((count:any) => count + 1)}>Increase</button>
    );
  };
  
  export default IncreaseButton;