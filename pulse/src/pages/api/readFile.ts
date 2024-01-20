import { NextApiHandler } from 'next';
import textract from 'textract';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { url } = req.body;
  console.log("url: " + url);

  if (!url) {
    res.status(400).json({ success: false, error: 'URL is required.' });
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      res.status(response.status).json({ success: false, error: `Failed to fetch file: ${response.statusText}` });
      return;
    }

    const fileBuffer = await response.arrayBuffer();
    const text = await extractText(fileBuffer);

    res.status(200).json({ success: true, text }); // Include the extracted text in the response
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const extractText = async (buffer: ArrayBuffer): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    textract.fromBufferWithName('file.pptx', Buffer.from(buffer), (error, text) => {
      if (error) {
        reject(error);
      } else {
        resolve(text);
      }
    });
  });
};

export default handler;
