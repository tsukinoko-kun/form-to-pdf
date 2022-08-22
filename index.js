import PDFDocument from "pdfkit";

const fieldsToIgnore = new Set(["producer", "author", "title", "head"]);

const createPdf = (data) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject("Timeout");
    }, 5000);

    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: 80,
        bottom: 40,
        left: 40,
        right: 40,
      },
      bufferPages: true,
      info: {
        Author: data.author ?? data.producer ?? "pdfkit",
        Producer: data.producer ?? data.author ?? "pdfkit",
        Title: data.title ?? "Form",
      },
    });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
      clearTimeout(timeout);
    });
    doc.on("error", reject);

    if ("head" in data && typeof data.head == "string") {
      doc.text(data.head.replace(/\\n/g, "\n") + "\n\n", {
        align: "right",
      });
    }

    for (const key of Object.keys(data) ?? []) {
      if (!fieldsToIgnore.has(key)) {
        doc.text(`${key}: ${data[key]}`);
      }
    }

    doc.end();
  });

export default defineComponent({
  async run({ steps, $ }) {
    const req =
      "trigger" in steps && "event" in steps.trigger
        ? steps.trigger.event ?? {}
        : {};

    const data = "body" in req ? req.body : req;

    const pdfData = await createPdf(data);

    try {
      await $.respond({
        body: pdfData,
        status: 200,
        headers: {
          "Content-Length": Buffer.byteLength(pdfData),
          "Content-Type": "application/pdf",
          "Content-disposition": `attachment;filename=${
            data.title ?? "Form"
          }.pdf`,
        },
      });
    } catch (error) {
      $.flow.exit(error);
    }
  },
});
