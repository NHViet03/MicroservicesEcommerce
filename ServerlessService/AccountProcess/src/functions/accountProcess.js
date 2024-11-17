const { app } = require("@azure/functions");
const sendGrid = require("@sendgrid/mail");

sendGrid.setApiKey(process.env.SG_KEY);

app.serviceBusQueue("accountProcess", {
  connectionString: "dreamer_RootManageSharedAccessKey_SERVICEBUS",
  connection: "dreamer_RootManageSharedAccessKey_SERVICEBUS",
  queueName: process.env.queueName,
  handler: async (message, context) => {
    const draft = {
      from: process.env.SG_FROM,
      to: message["email"],
      subject: message["subject"],
      html: `
        <h3>Hi ${message["firstName"]} ${message["lastName"]},</h3>
        ${message["content"]}  
        <p style="margin-bottom:24px">Please verify before: ${message["expiresAt"]}</p>
        <i>Thank you for using our service!</i>
      `,
    };

    try {
      let sg_response = await sendGrid.send(draft);

      context.log(sg_response);
    } catch (error) {
      context.log(JSON.stringify(error));
    }
  },
});
