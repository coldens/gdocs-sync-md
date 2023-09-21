import { getFirestore } from 'firebase-admin/firestore';

/**
 * Repository to save and get tokens from firestore
 *
 * This is the repository that will be used to save the tokens in firestore
 * after the user authorizes the app to access their profile and documents.
 */
export default class TokenRepository {
  collection: FirebaseFirestore.CollectionReference;

  constructor(private readonly firestore = getFirestore()) {
    this.collection = this.firestore.collection('tokens');
  }

  async save(email: string, { profile, tokens }: Data) {
    await this.collection.doc(email).set(
      { profile, tokens },
      {
        merge: true,
      },
    );
  }

  async get(email: string): Promise<Data | undefined> {
    const dbToken = await this.collection.doc(email).get();
    const data = dbToken.data();

    return data as Data;
  }
}

type Data = {
  profile: {
    email?: string | null;
    family_name?: string | null;
    given_name?: string | null;
    hd?: string | null;
    id?: string | null;
    locale?: string | null;
    name?: string | null;
    picture?: string | null;
    verified_email?: boolean | null;
  };
  tokens: {
    refresh_token?: string | null;
    expiry_date?: number | null;
    access_token?: string | null;
    token_type?: string | null;
    id_token?: string | null;
    scope?: string;
  };
};
