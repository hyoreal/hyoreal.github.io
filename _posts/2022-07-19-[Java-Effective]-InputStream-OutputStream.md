---

layout: post

title: "[Java-Effective] I/O "

comments: true

categories: [Java, I/O]

tags: [Java, I/O]

---

### InputStream, OutputSteam

InputStream, OutputStream

- Java에서 입출력을 다루기 위한 InputStream, OutputStream 제공
- 스트림은 단방향으로만 데이터를 전송할 수 있기 때문에, 입출력을 동시에 처리하기 위해서는 각각의 스트림 필요
- 어떤 대상을 다루느냐에 따라 종류 나뉨
  - File을 다룰때 : FileInputStream / FileOutputStream
  - Process 다룰때 : PipedInputStream / PipedOutputStream

FileInputStream / FileOutputStream

- FileInputStream : 파일에서 값을 byte 단위로 가져옴, 바이트 기반 스트림
- BufferedInputStream
  - FileInputStream의 보조 스트림, 성능 향상 도움
  - Buffer : 바이트 배열, 여러 바이트 저장, 한 번에 많은 양의 데이터 입출력 도와주는 임시 저장 공간
- [🔗InputStream Methods](https://docs.oracle.com/javase/7/docs/api/java/io/InputStream.html)

```java
import java.io.FileInputStream;
  
public class FileInputStreamExample {
    public static void main(String[] args) {
      try {
        FileInputStream fileInput = new FileInputStream("codestates.txt");
        int i = 0;
        while ((i = foileInput.read()) != -1) { //fileInput.read()의 리턴값을 i에 저장 후 값이 -1인지 확인
          System.out.println((char)i);
        }
        fileInput.close();
      }
      catch (Exception e) {
        System.out.println(e);
      }
    }
    
    try {
      FileInputStream fileInput = new FileInputStream("codestates.txt");
      BufferedInputStream bufferedInput = new BufferedInputStream(fileInput);
      int i = 0;
      while ((i = bufferedInput.read()) != -1) {
        System.out.println((char)i);
      }
      catch (Exception e) {
        System.out.println(e);
      }
    }
  }
```

------

- FileOutputStream : 바이트 기반 스트림
- 🔗[OutputStream Methods](https://docs.oracle.com/javase/7/docs/api/java/io/OutputStream.html)

```java
import java.io.FileOutputStream;
  
  public class FileOutputStreamExample {
    public static void main(String[] args) {
      try {
        FileOutputStream fileOutput = new FileOutputStream("codestates.txt");
        String word = "code";
        
        byte[] b = word.getBytes();
        fileOutput.write(b);
        fileOutput.close();
      }
      catch (Exception e) {
        System.out.println(e);
      }
    }
  }
```

------

FileReader / FileWriter

- 문자 기반 스트림
- 문자 데이터를 다룰때 사용
- 바이트 기반 스트림의 InputStream이 Reader로, OutputStream이 Writer로 대응
- FileReader는 인코딩을 유니코드로, FileWriter는 유니코드를 인코딩으로 변환
- 바이트 기반 스트림과 마찬가지로, Reader에도 성능을 개선할 수 있는 BufferedReader 존재
- [🔗Reader](https://docs.oracle.com/javase/7/docs/api/java/io/Reader.html)
- [🔗Writer](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/Writer.html)

File : File 클래스로 파일과 디렉토리 접근 가능

```java
  import java.io.*;

  public class FileExample {
    public static void main(String args[]) throws IOException {
       File file = new File("../codestates.txt");

       System.out.println(file.getPath()); // 파일 위치 나타냄
       System.out.println(file.getParent()); // 상위폴더 위치 나타냄
       System.out.println(file.getCanonicalPath()); // 절대위치 나타냄
       System.out.println(file.canWrite()); // 파일 변경 여부 확인

       // 위치, 파일이름 지정
       File file = new File("./", "newCodestates.txt");
       file.createNewFile(); // 파일 생성

       // 폴더 지정해 안에 있는 파일들을 지정 가능
       File parentDir = new File("./");
       File[] list = parentDir.listFiles(); // 현재 위치에 있는 파일들을 배열로

       String prefix = "code";
       for(int i =0; i <list.length; i++) {
         String fileName = list[i].getName();

         if(fileName.endsWith("txt") && !fileName.startsWith("code")) {
           list[i].renameTo(new File(parentDir, prefix + fileName));
         }
       }
     }
   }
```