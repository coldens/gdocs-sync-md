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

  async delete(userId: string, id: string) {
    await this.collection.doc(userId).collection('documents').doc(id).delete();
  }

  async getAll(userId: string): Promise<DocIdTitle[]> {
    const documents = await this.collection
      .doc(userId)
      .collection('documents')
      .select('id', 'title')
      .get();

    return documents.docs.map((doc) => ({
      id: doc.data().id,
      title: doc.data().title,
    }));
  }
}

export interface Document {
  id: string;
  title: string;
  markdown: string;

  webhook?: {
    expiration: string;
    id: string;
    resourceId: string;
  };
}

type DocIdTitle = Omit<Document, 'markdown'>;
