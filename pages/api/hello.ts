// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import mime from 'mime';
// @ts-expect-error
import converter from 'rel-to-abs';
type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = req.query; // get url parameter
  if (!url || Array.isArray(url)) {
    res.setHeader('Content-Type', 'text/html');
    return res.end('You need to specify <code>url</code> query parameter');
  }

  const { data } = await axios.get(url, { responseType: 'arraybuffer' }); // set response type array buffer to access raw data

  // const urlMime = getMimeType(url); // get mime type of the requested url
  // res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Disposition', 'inline');
  res.send(converter.convert(data.toString(), url).toString());
}

const getMimeType = (url: string) => {
  if (url.indexOf('?') !== -1) {
    // remove url query so we can have a clean extension
    url = url.split('?')[0];
  }
  return mime.getType(url) || 'text/html'; // if there is no extension return as html
};
