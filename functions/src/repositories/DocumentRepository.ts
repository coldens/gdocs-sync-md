import { getFirestore } from 'firebase-admin/firestore';

/**
 * Repository to save and get documents from firestore
 *
 * This is the repository that will be used to save the documents in firestore
 * after the user authorizes the app to access their profile and documents.
 */
export default class DocumentRepository {
  private readonly collection: FirebaseFirestore.CollectionReference;

  constructor(private readonly firestore = getFirestore()) {
    this.collection = this.firestore.collection('documents');
  }

  async save(userId: string, data: Document) {
    await this.collection
      .doc(userId)
      .collection('documents')
      .doc(data.id)
      .set(data, {
        merge: true,
      });
  }

  async get(userId: string, id: string): Promise<Document | undefined> {
    const document = await this.collection
      .doc(userId)
      .collection('documents')
      .doc(id)
      .get();

    return document.data() as Document;
  }

  async getAllIds(userId: string): Promise<string[]> {
    const documents = await this.collection
      .doc(userId)
      .collection('documents')
      .select('id')
      .get();

    return documents.docs.map((doc) => doc.data().id);
  }
}

type Document = {
  id: string;
  markdown: string;
};
