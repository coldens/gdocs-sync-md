import { getFirestore } from 'firebase-admin/firestore';

/**
 * Repository to save and get documents from firestore
 *
 * This is the repository that will be used to save the documents in firestore
 * after the user authorizes the app to access their profile and documents.
 */
export default class DocumentRepository {
  private collection: FirebaseFirestore.CollectionReference;

  constructor(private readonly firestore = getFirestore()) {
    this.collection = this.firestore.collection('documents');
  }

  async save(email: string, data: Document) {
    await this.collection
      .doc(email)
      .collection('documents')
      .doc(data.id)
      .set(data, {
        merge: true,
      });
  }

  async get(email: string, id: string): Promise<Document | undefined> {
    const document = await this.collection
      .doc(email)
      .collection('documents')
      .doc(id)
      .get();

    return document.data() as Document;
  }

  async getAllIds(email: string): Promise<string[]> {
    const documents = await this.collection
      .doc(email)
      .collection('documents')
      .select('id')
      .get();

    return documents.docs.map((doc) => doc.data().id);
  }
}

type Document = {
  id: string;
  markdown: string;
  title: string;
};
