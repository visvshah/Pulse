//@ts-nocheck
import * as React from 'react';
import { useEdgeStore } from '../lib/edgestore';
import { db} from '~/utils/firebase';
import { collection, getDocs } from "firebase/firestore";
 
export default function Page() {
  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();
  //const [url, setUrl] = React.useState<string>();
  // const db = app.firestore();
  // const [lessons, lessonsLoading, lessonsError] = useCollection(
  //   db.collection("lessons"),
  //   {}
  // );
  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0]);
        }}
      />
      <button
        onClick={async () => {
          const lessonsRef = collection(db, "lessons");
          getDocs(lessonsRef).then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              console.log(doc.data());
            });
          });
          // console.log(lessons);
          //   const lessonsRef = sRef(db, 'lessons')
            
          // console.log("Lessons ref: " + lessonsRef)
          // get(lessonsRef).then((snapshot) => {
          //   if (snapshot.exists()) {
          //     console.log("Works!");
          //     console.log(snapshot.val());
          //   } else {
          //     console.log("No data available");
          //   }
          // }).catch((error) => {
          //   console.error(error);
          // }
          // );
          if (false) {
            const res = await edgestore.publicFiles.upload({
              file,
              onProgressChange: (progress) => {
                // you can use this to show a progress bar
                console.log(progress);
              },
              options: {
                temporary: true,
              },
            });
            // you can run some server action or api here
            // to add the necessary data to your database
            console.log(res);
            //setUrl(res.url);
            let url = res.url;
            console.log(url)

            try {
              const requestUrl = "http://localhost:5000/transcribe?link=" + url;
              const response = await fetch(requestUrl);

                if (response.ok) {
                  const result = await response.json();
                  console.log('Transcription result:', result.text);
                } else {
                  console.error(`Error: ${response.status}, ${await response.text()}`);
                }
            } catch (error: any) {
              console.error('API Request Error:', error!.message);
            } 
        
          }
        }}
      >
        Upload Video
      </button>
    </div>
  );
}





// "use client";

// import { SingleImageDropzone } from "@/components/single-image-dropzone";
// import { useEdgeStore } from "@/lib/edgestore";
// import Link from "next/link";
// import { useState } from "react";

// export default function Page() {
//   const [file, setFile] = useState<File>();
//   const [progress, setProgress] = useState(0);
//   const [urls, setUrls] = useState<{
//     url: string;
//     thumbnailUrl: string | null;
//   }>();
//   const { edgestore } = useEdgeStore();

//   return (
//     <div className="flex flex-col items-center m-6 gap-2">
//       <SingleImageDropzone
//         width={200}
//         height={200}
//         value={file}
//         dropzoneOptions={{
//           maxSize: 1024 * 1024 * 1, // 1MB
//         }}
//         onChange={(file) => {
//           setFile(file);
//         }}
//       />
//       <div className="h-[6px] w-44 border rounded overflow-hidden">
//         <div
//           className="h-full bg-white transition-all duration-150"
//           style={{
//             width: `${progress}%`,
//           }}
//         />
//       </div>
//       <button
//         className="bg-white text-black rounded px-2 hover:opacity-80"
//         onClick={async () => {
//           if (file) {
//             const res = await edgestore.myPublicImages.upload({
//               file,
//               input: { type: "post" },
//               onProgressChange: (progress) => {
//                 setProgress(progress);
//               },
//             });
//             // save your data here
//             setUrls({
//               url: res.url,
//               thumbnailUrl: res.thumbnailUrl,
//             });
//           }
//         }}
//       >
//         Upload
//       </button>
//       {urls?.url && (
//         <Link href={urls.url} target="_blank">
//           URL
//         </Link>
//       )}
//       {urls?.thumbnailUrl && (
//         <Link href={urls.thumbnailUrl} target="_blank">
//           THUMBNAIL
//         </Link>
//       )}
//     </div>
//   );
// }