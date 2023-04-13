import {createClient} from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.REACT_APP_PROJECT_ID,
  dataset: "production",
  useCdn: false,
  apiVersion: "2023-04-02",
  token: process.env.REACT_APP_PROJECT_TOKEN
});

export const builder = imageUrlBuilder(client);
export const urlFor = (source: string) => builder.image(source);