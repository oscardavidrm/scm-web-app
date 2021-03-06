import { ApolloError } from 'apollo-server-core';
import { User } from '../../../mongo-db/models';
import authenticated from '../../middleware/authenticated';

const userQueries = {
  user: async (_, args) => {
    const { id } = args;
    const user = await User.findById(id);

    if (!user) throw new ApolloError('¡No ha sido posible encontrar el usuario!');
    else return user;
  },
  users: authenticated(async (_, { filters: { limit, search } }) => {
    const users = await User.find({
      deleted: false,
      kind: {
        $exists: false
      },
      $or: [
        { username: { $in: [new RegExp(search, 'i')] } },
        { firstName: { $in: [new RegExp(search, 'i')] } },
        { lastName: { $in: [new RegExp(search, 'i')] } },
        { email: { $in: [new RegExp(search, 'i')] } },
        { role: { $in: [new RegExp(search, 'i')] } }
      ]
    }).limit(limit || Number.MAX_SAFE_INTEGER);

    if (!users) throw new ApolloError('¡Ha habido un error cargando los usuarios!');
    else return users;
  }),
  deletedUsers: authenticated(async () => {
    const users = await User.find({ deleted: true, kind: { $exists: false } });

    if (!users) throw new ApolloError('¡Ha habido un error cargando los usuarios eliminados!');
    else return users;
  })
};

export default userQueries;
