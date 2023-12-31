import { getFirestore } from 'firebase-admin/firestore';

/**
 * Repository to save and get tokens from firestore
 *
 * This is the repository that will be used to save the tokens in firestore
 * after the user authorizes the app to access their profile and documents.
 */
export default class TokenRepository {
  private readonly collection: FirebaseFirestore.CollectionReference;

  constructor(private readonly firestore = getFirestore()) {
    this.collection = this.firestore.collection('tokens');
  }

  async save(userId: string, { profile, tokens }: Data) {
    await this.collection.doc(userId).set(
      { profile, tokens },
      {
        merge: true,
      },
    );
  }

  async get(userId: string): Promise<Data | undefined> {
    const dbToken = await this.collection.doc(userId).get();
    const data = dbToken.data();

    return data as Data;
  }

  async getProfiles(): Promise<Profile[]> {
    const dbTokens = await this.collection.select('profile').get();

    const profiles = dbTokens.docs.map((doc) => {
      const uid = doc.id;
      const profile = doc.data().profile as Profile;
      profile.uid = uid;
      return profile;
    });

    return profiles;
  }

  async remove(userId: string) {
    await this.collection.doc(userId).delete();
  }
}

type Profile = {
  email?: string | null;
  family_name?: string | null;
  given_name?: string | null;
  hd?: string | null;
  id?: string | null;
  locale?: string | null;
  name?: string | null;
  picture?: string | null;
  verified_email?: boolean | null;
  uid?: string;
};

type Token = {
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
  scope?: string;
};

type Data = {
  profile: Profile;
  tokens: Token;
};
