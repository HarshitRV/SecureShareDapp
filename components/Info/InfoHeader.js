export const InfoHeader = (props) => {
  return (
    <>
      <div className="boxHeader">
        {/* <Image className="boxImage" src ={share}/> */}
        <h1 className="textHeader">Secure Share dApp.</h1>
        <h1 className="textSubHeader"> Welcome to fileshare 📁 </h1>
      </div>
      <div className="walletHeader">
        <p className="paraContent">Supported file extensions</p>
        <p className="paraType">ppt | doc | docx | Txt | Zip | pptx</p>
      </div>
    </>
  );
};
