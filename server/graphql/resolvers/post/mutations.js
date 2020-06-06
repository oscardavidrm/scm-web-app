import { Post } from '../../../mongo-db/models';
import authenticated from '../../middleware/authenticated';
import uploaders from '../aws/uploaders';

const { fileUploader } = uploaders;

const postMutations = {
  post: authenticated(async (_, { post }, { req: { userRequesting } }) => {
    const postToCreate = { ...post };
    let attachments = [];
    let gallery = [];

    if (postToCreate.attachments) attachments = [...postToCreate.attachments];
    if (postToCreate.gallery) gallery = [...postToCreate.gallery];

    delete postToCreate.attachments;
    delete postToCreate.gallery;

    const newPost = new Post({ author: userRequesting.id, ...postToCreate });

    const attachmentsUpload = attachments.map(file =>
      fileUploader(_, { file, folderKey: 'posts', id: newPost.id })
    );
    newPost.attachments = await Promise.all(attachmentsUpload);

    const galleryUpload = gallery.map(file =>
      fileUploader(_, { file, folderKey: 'posts', id: newPost.id })
    );
    newPost.attachments = await Promise.all(galleryUpload);

    await newPost.save();

    return Post.findOne({ _id: newPost.id }).populate('author');
  })
};

export default postMutations;
