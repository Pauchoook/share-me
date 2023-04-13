export const searchPinQuery = (categoryId: string, searchValue: string) => {
  const category = categoryId ? `&& category match '${categoryId}*'` : "";
  return `*[_type == "pin" && title match '${searchValue}*' ${category}] | order(_createdAt desc) [0...30]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      username,
      picture
    },
    save[]{
      _key,
      postedBy->{
        _id,
        username,
        picture
      },
    },
  }`;
};

export const slicePinQuery = (categoryId: string, searchValue: string, start: number, max: number, userId?: string) => {
  const category = categoryId ? `&& category match '${categoryId}*'` : "";
  const user = userId ? `&& userId == '${userId}'` : "";
  console.log(user)

  return `*[_type == "pin" && title match '${searchValue}*' ${category} ${user}] | order(_createdAt desc) [${start}...${max}]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      username,
      picture
    },
    save[]{
      _key,
      postedBy->{
        _id,
        username,
        picture
      },
    },
  }`;
};

export const userQuery = (userId: string) => {
  return `*[_type == 'user' && _id == '${userId}']`;
};

export const pinDetailQuery = (pinId: string) => {
  return `*[_type == "pin" && _id == '${pinId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    category,
    destination,
    postedBy->{
      _id,
      username,
      picture
    },
   save[]{
      postedBy->{
        _id,
        username,
        picture
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        username,
        picture
      },
    }
  }`;
};

export const pinDetailQueryMore = (category: string, id: string) => {
  return `*[_type == "pin" && category == '${category}' && _id != '${id}' ]{
    image {
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      username,
      picture
    },
    save[]{
      _key,
      postedBy->{
        _id,
        username,
        picture
      },
    },
  }`;
};

export const userCreatedPinsQuery = (userId: string) => {
  return `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc) [0...10]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      username,
      picture
    },
    save[]{
      postedBy->{
        _id,
        username,
        picture
      },
    },
  }`;
};

export const userSavedPinsQuery = (userId: string) => {
  return `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) [0...10] {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      username,
      picture
    },
    save[]{
      postedBy->{
        _id,
        username,
        picture
      },
    },
  }`;
};
