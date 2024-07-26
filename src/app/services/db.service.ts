import { Injectable } from '@angular/core';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc,getDoc } from "firebase/firestore"; 
import { AuthService } from './auth.service';
import { Snippets } from '../../models/Snippets';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db?:any
  constructor(private authService:AuthService, private router:Router) {
    this.db = getFirestore();
   }

   async createSnippet(snippet: Snippets) {
    try {
      const docRef = await addDoc(collection(this.db, "snippets"), {
        ...snippet,
        by: this.authService.getUid()
      });
      console.log("Document written with ID: ", docRef.id);
      this.router.navigate(["/"])
      
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("error while creating")
    }
  }


   async getAllSnippet(){
   const querySnapshot = await getDocs(collection(this.db, "snippets"));
   let result:any[] = []
    querySnapshot.forEach((doc) => {
    // console.log(`${doc.id} => ${doc.data()}`);
    result.push({id:doc.id,...doc.data()})
    });
    return result;
   }

   async getSnippetById(docId:string){
    const docRef = doc(this.db, "snippets", docId);
    const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
   console.log("Document data:", docSnap.data());
   return docSnap.data();
    } else {
  // docSnap.data() will be undefined in this case
     console.log("No such document!");
     return {
      id:"1",
      title:"not found",
      code:"not found"
     }
    }
  }
}
