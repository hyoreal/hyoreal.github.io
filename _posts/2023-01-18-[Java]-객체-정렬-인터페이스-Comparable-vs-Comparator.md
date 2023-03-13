---

layout: post

title: "[Java] 객체 정렬 인터페이스 Comparable vs Comparator "

comments: true

categories: [Java]

tags: [Java]

---

### **객체 정렬의 필요성**

Primitive 타입의 단순 int, double..와 같은 데이터는 부등호를 사용하여 쉬운 비교 가능.

하지만 **객체는 명확한 비교 기준이 없어 부등호 사용 시 컴파일 에러 발생.**

```java
int[] num = {9, -3, 12, 5, 23};
Array.sort(num);
System.out.println(Arrays.toString(num));

// 출력
// [-3, 5, 9, 12, 23]

public class Fruit {
	private String name;
    private int amount;
    
    public Fruit(String name, int amount) {
    	this.name = name;
        this.amount = amount;
    }
}

List<Fruit> fruits = new ArrayList<>();
fruits.add(new Fruit("apple", 5000));
fruits.add(new Fruit("kiwi", 1000));
fruits.add(new Fruit("banana", 8000));

Collections.sort(fruits); // 컴파일 에러 발생
```

------

### **Comparable Interface**

- Java 기본 제공 인터페이스
- **compareTo** 메서드를 **반드시** 구현해야함
- **자기 자신과 파라미터 객체를 비교함**

------

### **Comparable Interface 사용법**

정렬 대상 클래스에 Java 기본 제공 Comparable 인터페이스를 구현

```java
// 기본 구현 방식
public class 클래스명 implements Comparable<타입> {
	
    ...
    
    @Override
    public int compareTo(타입 o) {
    	// 비교 로직 구현
    }
}
```

 

🔻 예시코드

```java
class Fruit implements Comparable<Fruit> {
	String name;
    int amount;
    
    Fruit(String name, int amount) {
    	this.name = name;
        this.amount = amount;
    }
    
    @Override
    public int compareTo(Fruit o) {
    	
        // 자기 자신의 금액이 o의 금액보다 크다면 1 반환
        if (this.amount > o.amount) return 1;
        
        // 자기 자신의 금액과 o의 금액이 같다면 0 반환
        else if (this.amount == o.amount) return 0;
        
        // 자기 자신의 금액이 o의 금액보다 작다면 -1 반환
        else return -1;
    }
}
```

compareTo 메서드는 int를 반환하도록 하여 1, 0, -1로 대소관계를 파악하는 것이다.

 

### **주의!!**

-1 과정에서 자료형의 범위를 벗어나 Underflow가 발생할 수 있다!

------

### **Comparator Interface**

- Java 기본 제공 인터페이스
- **compare** 메서드를 **반드시** 구현해야함
- **파라미터로 들어오는 두 객체끼리 비교함**

------

### **Comparator Interface 사용법**

1. Comparable 인터페이스와 같이 클래스에 구현

```java
import java.util.Comparator; // import문 필요

public class 클래스명 implements Comparator<타입> {
    ...
    
    @Override
    public int compare(타입 o1, 타입 o2) {
    	// 비교 로직
    }
}
```

 

2. Comparator 인터페이스의 구현체를 Arrays.sort() 혹은 Collections.sort() 에 추가 인자로 넘겨 새로운 정렬 기준으로 정렬

```java
import java.util.Comparator;

class Main {

	...
    
    Comparator<타입> comparator = new Comparator<타입>() {
    	@Override
        public int compare(타입 o1, 타입 o2) {
        	return // 비교 로직
        }
        
    }
    
    Collections.sort(자료형, comparator);
}
```

 

🔻 예시코드

1. 기본 구현

```java
class Fruit {
    String name;
    int amount;
    
    Fruit(String name, int amount) {
    	this.name = name;
        this.amount = amount;
    }
}

List<Fruit> fruits = new ArrayList<>();
fruits.add(new Fruit("apple", 5000));
fruits.add(new Fruit("kiwi", 1000));
fruits.add(new Fruit("banana", 8000));

Comparator<Fruit> comparator = new Comparator<Fruit>() {
    @Override
    public int compare(Fruit o1, Fruit o2) {
        if (o1.amount > o2.amount) return 1;
        else if (o1.amount == o2.amount) return 0;
        else return -1;
    }
};

Collections.sort(fruits, comparator);
```

 

2. 구현 + 메서드

```java
// 위 기본 코드와 완전 동일한 코드
class Fruit {
    String name;
    int amount;
    
    Fruit(String name, int amount) {
    	this.name = name;
        this.amount = amount;
    }
}

List<Fruit> fruits = new ArrayList<>();
fruits.add(new Fruit("apple", 5000));
fruits.add(new Fruit("kiwi", 1000));
fruits.add(new Fruit("banana", 8000));

Comparator<Fruit> comparator = new Comparator<Fruit>() {
    @Override
    public int compare(Fruit o1, Fruit o2) {
        return Integer.compare(o1.amount, o2.amount);
    }
};

Collections.sort(fruits, comparator);
```

 

3. 람다

```java
// 위 코드들과 완전 동일한 코드
class Fruit {
    String name;
    int amount;
    
    Fruit(String name, int amount) {
    	this.name = name;
        this.amount = amount;
    }
}

List<Fruit> fruits = new ArrayList<>();
fruits.add(new Fruit("apple", 5000));
fruits.add(new Fruit("kiwi", 1000));
fruits.add(new Fruit("banana", 8000));

Comparator<Fruit> comparator = (o1, o2) -> Integer.compare(o1.amount, o2.amount);

Collections.sort(fruits, comparator);
```

 

4. Comparator.comparingInt + 람다

```java
// 위 코드들과 완전 동일한 코드
class Fruit {
    String name;
    int amount;
    
    Fruit(String name, int amount) {
    	this.name = name;
        this.amount = amount;
    }
}

List<Fruit> fruits = new ArrayList<>();
fruits.add(new Fruit("apple", 5000));
fruits.add(new Fruit("kiwi", 1000));
fruits.add(new Fruit("banana", 8000));

Comparator<Fruit> comparator = Comparator.comparingInt(o -> o.amount);

Collections.sort(fruits, comparator);
```

 

> 참고 블로그
> https://st-lab.tistory.com/243
> https://www.daleseo.com/java-comparable-comparator/