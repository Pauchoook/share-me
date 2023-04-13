export interface IPin {
  _id: string;
  destination: string;
  category: string;
  title: string;
  about: string;
  image: {
    asset: {
      url: string;
    };
  }
  postedBy: {
    _id: string;
    picture: string;
    username: string;
  }
  comments: {
    postedBy: {
      _id: string;
      username: string;
      picture: string;
    }
    comment: string;
  }[]
  save: {
    postedBy: {
      _id: string
    }
  }[] | null
}