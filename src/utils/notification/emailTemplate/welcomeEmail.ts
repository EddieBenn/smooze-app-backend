import config from "../../../config";
function welcomeEmail(firstname: string, token: string) {
  if(firstname.length<1 || token.length<5){
    const errMessage = firstname.length<1 ? "firstname is not specified" : "token is not specified"
    throw new Error(errMessage)
  }
  const html = `<!DOCTYPE html>
  <table
    class="full-width-container"
    style="
      height: 100%;
      font-family: Calibri;
      padding-bottom: 30px;
      padding-top: 30px;
      padding-left: 0px;
      padding-right: 0px;
    "
    height="100%"
    cellspacing="0"
    cellpadding="0"
    bgcolor="#eeeeee"
    border="0"
  >
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table
            class="container"
            style="width: 720px"
            cellspacing="0"
            cellpadding="0"
            width="720"
            bgcolor="#ffffff"
            border="0"
          >
            <tbody>
              <tr>
                <td valign="top" cellPadding="50" cellPadding="50" border="10">
                  <table
                    class="container header"
                    style="background: #1a2155; width: 100%"
                    cellspacing="20"
                    cellpadding="20"
                    border="0"
                  >
                    <tbody>
                      <tr>
                        <td align="left">
                          <h1 style="color:white;vertical-align: bottom;margin-bottom: 0;"><img src="https://asset.cloudinary.com/dcrpfxivl/86bb6e969e189748386c0e9aa5788c4a" alt="Smooze"></h1>
                        </td>
                        <td align="right">
                          <b
                            style="
                              font-size: 18px;
                              text-decoration: none;
                              vertical-align: bottom;
                              color: #fff;
                            "
                            >Welcome To Smooze App</b
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    class="container hero-subheader"
                    style="width: 100%; color: #1a2155"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                  >
                    <tbody>
                      <tr>
                        <td
                          class="hero-subheader__title"
                          style="
                            font-family: calibri;
                            font-size: 11pt;
                            color: black;
                            font-weight: 600;
                            padding-bottom: 15px;
                            padding-top: 30px;
                            padding-left: 30px;
                            padding-right: 0px;
                          "
                          align="left"
                        >
                          Dear ${firstname},
                        </td>
                      </tr>
                      <tr style="padding: 0px">
                        <td
                          class="hero-subheader__content"
                          style="
                            font-family: calibri;
                            font-size: 11pt;
                            color: black;
                            padding-left: 30px;
                          "
                          align="left"
                        >
                          Thank you for joining Snooze<br /><br />
                         We\’re so excited to have you on board and can\’t wait to get to know and serve you.<br>
                         <a href="${config.FRONTEND_BASE_URL}/verify/?token=${token}">click here to verify</a> or copy this ${config.FRONTEND_BASE_URL}/verify/?token=${token} link and paste in your browser.
                         <br>
                          Thank you. <br /><br />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                        
    `;
  return html;
}
export default welcomeEmail;
