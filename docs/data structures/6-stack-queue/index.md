---
sidebar_position: 6
title: 'Stack & Queue'
---

## 27. What is a stack, and what are its core operations?

**Stack** হলো একটা linear data structure যেটা **LIFO (Last In, First Out)** principle অনুসরণ করে — অর্থাৎ যে element সবচেয়ে শেষে যোগ হয়েছে, সেটাই সবার আগে বের হবে।

**Core operations:**
- **push(x)**: stack এর top এ নতুন element যোগ করা — `O(1)`
- **pop()**: stack এর top থেকে element remove করা — `O(1)`
- **top()/peek()**: top element দেখা, remove না করে — `O(1)`
- **isEmpty()**: stack খালি কিনা check করা — `O(1)`

**Stack diagram:**

```text
push(10), push(20), push(30)

        top
         |
         v
      +-----+
      |  30 |  <- last pushed, first popped
      +-----+
      |  20 |
      +-----+
      |  10 |
      +-----+
      bottom

pop() করলে 30 বের হবে।
```

**Operation walkthrough:**

```text
Start:     []
push(10):  [10]
push(20):  [10, 20]
push(30):  [10, 20, 30]
top():     30
pop():     [10, 20]
top():     20
```


### What does LIFO (Last In, First Out) mean?

LIFO মানে হলো — সর্বশেষ যে element push করা হয়েছে, সেটাই সবার আগে pop হবে। এটাকে একটা **প্লেটের স্তূপ (stack of plates)** এর সাথে তুলনা করা যায় — সবার উপরে যে প্লেটটা রাখা হয়, সেটাই সবার আগে তুলে নেওয়া হয়।

```text
Plate stack:

Push order:
Plate 1 -> Plate 2 -> Plate 3

Current stack:
   Plate 3  <- first remove
   Plate 2
   Plate 1

Pop order:
Plate 3 -> Plate 2 -> Plate 1
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    stack<int> st;
    st.push(1);
    st.push(2);
    st.push(3);

    cout << "Popping order (LIFO): ";
    while (!st.empty()) {
        cout << st.top() << " ";
        st.pop();
    }
    cout << endl;
    return 0;
}
```

```
Popping order (LIFO): 3 2 1
```


### What are real-world applications of stacks (call stack, undo/redo, expression parsing)?

1. **Call Stack**: প্রতিটি function call করার সময় তার local variables এবং return address একটা stack frame হিসেবে **call stack** এ push হয়। Function return করলে সেই frame pop হয়ে যায়। এই mechanism এর কারণেই recursion কাজ করে।

2. **Undo/Redo**: Text editor বা image editor এ প্রতিটি action একটা stack এ push করা হয়। "Undo" চাপলে সর্বশেষ action stack থেকে pop করে reverse করা হয়।

3. **Expression Parsing**: Compiler/interpreter এ infix থেকে postfix conversion, বা postfix expression evaluate করা, অথবা **balanced parentheses check** করার জন্য stack ব্যবহৃত হয়।

4. **Browser History (back button)**, **DFS (Depth-First Search)** traversal এও stack (explicit বা implicit recursion এর মাধ্যমে) ব্যবহৃত হয়।

**Call stack example:**

```text
main() calls A()
A() calls B()
B() calls C()

Call Stack:
      +-----+
top ->| C() |
      +-----+
      | B() |
      +-----+
      | A() |
      +-----+
      |main |
      +-----+

C() return করলে C() frame pop হবে।
তারপর B(), তারপর A(), তারপর main()।
```

**Undo stack example:**

```text
Actions:
type "A" -> type "B" -> delete "B"

Undo stack:
top -> delete "B"
       type "B"
       type "A"

Undo চাপলে সবার আগে "delete B" reverse হবে।
```


## 28. How would you implement a stack using an array vs. a linked list?

**Array-based Stack:**

```text
Array / vector stack:

Index:  0   1   2
Value: 10  20  30
                 ^
                top

push(40):
Index:  0   1   2   3
Value: 10  20  30  40
                     ^
                    top

pop():
Index:  0   1   2
Value: 10  20  30
                 ^
                top
```

```cpp
#include <bits/stdc++.h>
using namespace std;

class ArrayStack {
    vector<int> arr;
public:
    void push(int x) {
        arr.push_back(x);   // amortized O(1)
    }
    void pop() {
        if (!arr.empty()) arr.pop_back();   // O(1)
    }
    int top() {
        return arr.back();   // O(1)
    }
    bool isEmpty() {
        return arr.empty();
    }
};

int main() {
    ArrayStack st;
    st.push(10);
    st.push(20);
    st.push(30);

    cout << "Top element: " << st.top() << endl;
    st.pop();
    cout << "Top after pop: " << st.top() << endl;
    return 0;
}
```

```
Top element: 30
Top after pop: 20
```

**Linked List-based Stack:**

```text
Linked list stack:

head/top
   |
   v
+------+      +------+      +------+
|  30  | ---> |  20  | ---> |  10  | ---> NULL
+------+      +------+      +------+

push(40):

head/top
   |
   v
+------+      +------+      +------+      +------+
|  40  | ---> |  30  | ---> |  20  | ---> |  10  | ---> NULL
+------+      +------+      +------+      +------+

pop() করলে head node remove হয়।
```

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedListStack {
    Node* head;
public:
    LinkedListStack() : head(nullptr) {}

    void push(int x) {
        Node* newNode = new Node(x);
        newNode->next = head;
        head = newNode;   // O(1), কোনো shifting/resize লাগে না
    }
    void pop() {
        if (head != nullptr) {
            Node* temp = head;
            head = head->next;
            delete temp;
        }
    }
    int top() {
        return head->data;
    }
    bool isEmpty() {
        return head == nullptr;
    }
};

int main() {
    LinkedListStack st;
    st.push(10);
    st.push(20);
    st.push(30);

    cout << "Top element: " << st.top() << endl;
    st.pop();
    cout << "Top after pop: " << st.top() << endl;
    return 0;
}
```

```
Top element: 30
Top after pop: 20
```


### What are the trade-offs between the two implementations?

| বৈশিষ্ট্য | Array-based | Linked List-based |
|---|---|---|
| Memory | Compact (কোনো extra pointer লাগে না) | প্রতিটি node এ extra pointer লাগে |
| Push/Pop time | Amortized `O(1)` (resize এর কারণে occasionally `O(n)`) | সবসময় guaranteed `O(1)` |
| Cache locality | ভালো (contiguous memory) | খারাপ (scattered memory) |
| Size limit | Resize হতে পারে (dynamic array হলে) | Dynamically unlimited (memory থাকা পর্যন্ত) |

Practical ব্যবহারে array-based stack (যেমন `std::vector` বা `std::stack`) সাধারণত **preferred**, কারণ cache locality এর কারণে বাস্তবে দ্রুত কাজ করে, যদিও theoretical worst-case এ occasionally resize এর cost আছে।


###  How would you implement a stack using two queues?

Stack needs LIFO, but queue gives FIFO. তাই trick হলো `push` করার সময় queue reorder করা, যাতে newest element always front এ থাকে।

```text
push(1):
q2: [1]
swap -> q1: [1]

push(2):
q2: [2]
move q1 into q2: [2, 1]
swap -> q1: [2, 1]

push(3):
q2: [3]
move q1 into q2: [3, 2, 1]
swap -> q1: [3, 2, 1]

front of q1 = stack top = 3
```

```cpp
#include <bits/stdc++.h>
using namespace std;

class StackUsingQueues {
    queue<int> q1, q2;
public:
    void push(int x) {
        q2.push(x);
        // q1 এর সব পুরনো element q2 তে transfer করা, যাতে নতুন element সামনে থাকে
        while (!q1.empty()) {
            q2.push(q1.front());
            q1.pop();
        }
        swap(q1, q2);   // q1 কে main queue বানানো
    }
    void pop() {
        if (!q1.empty()) q1.pop();   // front এ থাকা মানেই সবচেয়ে সাম্প্রতিক element
    }
    int top() {
        return q1.front();
    }
    bool isEmpty() {
        return q1.empty();
    }
};

int main() {
    StackUsingQueues st;
    st.push(1);
    st.push(2);
    st.push(3);

    cout << "Top: " << st.top() << endl;   // Expect 3
    st.pop();
    cout << "Top after pop: " << st.top() << endl;   // Expect 2
    return 0;
}
```

```
Top: 3
Top after pop: 2
```
এখানে প্রতিটি `push` এ নতুন element `q2` তে দিয়ে বাকি সব পুরনো element কে তার পেছনে reorder করে দেওয়া হয়, ফলে **most recently pushed element সবসময় front এ** থাকে। এতে `push` হয় `O(n)`, কিন্তু `pop`/`top` হয় `O(1)`।


## 29. How do you evaluate postfix or prefix expressions using a stack?

**Postfix Evaluation:** operand আসলে stack এ push করা হয়, operator আসলে stack থেকে দুইটা operand pop করে operation করে আবার push করা হয়।

**Postfix example walkthrough:**

```text
Expression: 2 3 4 * +

Token  Stack
2      [2]
3      [2, 3]
4      [2, 3, 4]
*      pop 4 and 3 -> 3*4 = 12 -> [2, 12]
+      pop 12 and 2 -> 2+12 = 14 -> [14]

Answer = 14
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int evaluatePostfix(string expr) {
    stack<int> st;
    stringstream ss(expr);
    string token;

    while (ss >> token) {
        size_t parsed = 0;
        try {
            int value = stoi(token, &parsed);
            if (parsed == token.size()) {
                st.push(value); // negative এবং multi-digit operand-ও handle হয়
                continue;
            }
        } catch (const exception&) {
            // Operator হিসেবে নিচে validate হবে।
        }

        if (token == "+" || token == "-" || token == "*" || token == "/") {
            if (st.size() < 2) throw invalid_argument("Malformed postfix expression");
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if (token == "+") st.push(a + b);
            else if (token == "-") st.push(a - b);
            else if (token == "*") st.push(a * b);
            else {
                if (b == 0) throw domain_error("Division by zero");
                st.push(a / b);
            }
        } else {
            throw invalid_argument("Unknown token: " + token);
        }
    }
    if (st.size() != 1) throw invalid_argument("Malformed postfix expression");
    return st.top();
}

int main() {
    string expr = "2 3 4 * +";   // 2 + (3 * 4) = 14
    cout << "Postfix expression: \"" << expr << "\"" << endl;
    cout << "Result: " << evaluatePostfix(expr) << endl;
    return 0;
}
```

```
Postfix expression: "2 3 4 * +"
Result: 14
```
**Time Complexity**: `O(n)` — প্রতিটি token একবারই process হয়


**Infix থেকে postfix expression এ কীভাবে convert করবেন (Shunting Yard algorithm)?**

**Shunting Yard Algorithm** (Edsger Dijkstra এর তৈরি) ব্যবহার করে infix expression কে postfix এ convert করা হয়। এখানে দুইটা মূল কাঠামো লাগে: একটা **output** (result) এবং একটা **operator stack**।

**Infix to postfix walkthrough:**

```text
Infix: a + b * (c - d)

Read   Output     Operator Stack
a      a          []
+      a          [+]
b      ab         [+]
*      ab         [+, *]
(      ab         [+, *, (]
c      abc        [+, *, (]
-      abc        [+, *, (, -]
d      abcd       [+, *, (, -]
)      abcd-      [+, *]
end    abcd-*+    []

Postfix: abcd-*+
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int precedence(char op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    return 0;
}

string infixToPostfix(string infix) {
    stack<char> st;
    string postfix = "";

    for (char c : infix) {
        if (isalnum(c)) {
            postfix += c;
        }
        else if (c == '(') {
            st.push(c);
        }
        else if (c == ')') {
            while (!st.empty() && st.top() != '(') {
                postfix += st.top();
                st.pop();
            }
            st.pop();   // '(' remove করা
        }
        else {   // operator
            while (!st.empty() && precedence(st.top()) >= precedence(c)) {
                postfix += st.top();
                st.pop();
            }
            st.push(c);
        }
    }

    while (!st.empty()) {
        postfix += st.top();
        st.pop();
    }

    return postfix;
}

int main() {
    string infix = "a+b*(c-d)";
    cout << "Infix: " << infix << endl;
    cout << "Postfix: " << infixToPostfix(infix) << endl;
    return 0;
}
```

```
Infix: a+b*(c-d)
Postfix: abcd-*+
```
**Time Complexity**: `O(n)`


**Operator precedence এবং parentheses কীভাবে handle করবেন?**

- **Precedence**: প্রতিটি operator এর একটা numeric precedence value নির্ধারণ করা হয় (যেমন `*`, `/` এর precedence `+`, `-` থেকে বেশি)। যখন কোনো নতুন operator পড়া হয়, তখন stack এর top এ থাকা operator এর precedence যদি current operator এর সমান বা বেশি হয়, তাহলে সেই top operator কে **pop করে output এ যোগ** করা হয় (আগে সেটার কাজ শেষ করতে হবে)।

- **Parentheses**: `(` পেলে সরাসরি stack এ push করা হয় (একটা "boundary marker" হিসেবে)। `)` পেলে stack থেকে ততক্ষণ pop করা হয় যতক্ষণ না matching `(` পাওয়া যায় — এভাবে parentheses এর ভিতরের অংশের **higher priority** বজায় রাখা হয়। `(` কে কখনো output এ যোগ করা হয় না, শুধু stack থেকে discard করা হয়।

- **Associativity**: একই precedence এর multiple operator এর ক্ষেত্রে (যেমন `-` এবং `-`), সাধারণত **left-to-right** associativity মেনে চলা হয় (`>=` ব্যবহার করে, `>` না)।


## 30. What is the "next greater element" problem, and how is it solved using a stack?

**সমস্যা:** array এর প্রতিটি element এর জন্য তার ডানদিকে থাকা **প্রথম বড় element** খুঁজে বের করতে হবে (না থাকলে `-1`)।

**Approach: Monotonic Stack** — এমন একটা stack maintain করা হয় যেটাতে সবসময় elements একটা **decreasing order** এ থাকে (top থেকে bottom পর্যন্ত)।

**Example walkthrough:**

```text
arr = [4, 5, 2, 10, 8]

i=0, x=4
stack indices: [0]        values: [4]

i=1, x=5
5 > 4, so NGE of 4 = 5
stack: [1]                values: [5]

i=2, x=2
2 < 5, push
stack: [1, 2]             values: [5, 2]

i=3, x=10
10 > 2, so NGE of 2 = 10
10 > 5, so NGE of 5 = 10
stack: [3]                values: [10]

i=4, x=8
8 < 10, push
stack: [3, 4]             values: [10, 8]

Remaining elements 10 and 8 have no greater element -> -1

Answer: [5, 10, 10, -1, -1]
```

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> nextGreaterElement(vector<int>& arr) {
    int n = arr.size();
    vector<int> result(n, -1);
    stack<int> st;   // indices store করা হয়

    for (int i = 0; i < n; i++) {
        // current element স্ট্যাকের top এর চেয়ে বড় হলে, সেটা top এর "next greater"
        while (!st.empty() && arr[st.top()] < arr[i]) {
            result[st.top()] = arr[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}

int main() {
    vector<int> arr = {4, 5, 2, 10, 8};
    vector<int> result = nextGreaterElement(arr);

    cout << "Array:              ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    cout << "Next Greater Elem:  ";
    for (int x : result) cout << x << " ";
    cout << endl;
    return 0;
}
```

```
Array:              4 5 2 10 8
Next Greater Elem:  5 10 10 -1 -1
```


### How would you find the next greater element for every element in an array in O(n)?

Naive approach এ প্রতিটি element এর জন্য ডানদিকে scan করলে `O(n²)` লাগত। কিন্তু **monotonic stack** ব্যবহার করলে — stack এ শুধুমাত্র elements এর index রাখা হয় যাদের জন্য এখনো "next greater" পাওয়া যায়নি। যখনই কোনো নতুন element আসে, সেটা যদি stack এর top এর element থেকে বড় হয়, তাহলে top element এর answer পেয়ে যায় এবং stack থেকে pop হয়ে যায় — এই process ততক্ষণ চলে যতক্ষণ না stack এর top current element থেকে বড় হয় বা stack খালি হয়।

**Time Complexity**: `O(n)` — কারণ প্রতিটি element **সর্বোচ্চ একবার push এবং একবার pop** হয় (amortized analysis, ঠিক dynamic array এর মতো)।


### How is a monotonic stack used in problems like "largest rectangle in histogram"?

**সমস্যা:** একটা histogram (bar chart) দেওয়া আছে, যেখানে প্রতিটি bar এর একটা height আছে। সবচেয়ে বড় rectangle এর area বের করতে হবে যেটা এই histogram এর মধ্যে fit করে।

**মূল ধারণা:** প্রতিটি bar এর জন্য, সেই bar কে **height** ধরে সবচেয়ে বড় সম্ভাব্য rectangle বের করতে হয় — অর্থাৎ বামদিকে এবং ডানদিকে কতদূর পর্যন্ত এই height (বা তার বেশি) বজায় থাকে সেটা জানতে হয়। এখানে monotonic (increasing) stack ব্যবহার করে প্রতিটি bar এর জন্য তার **immediate smaller element** (বামে এবং ডানে) `O(n)` এ বের করা হয়।

**Histogram diagram:**

```text
heights = [2, 1, 5, 6, 2, 3]

Index:     0  1  2  3  4  5
Height:    2  1  5  6  2  3

Bars:
        |
      | |
      | |
      | |   |
|     | | | |
| |   | | | |
0 1 2 3 4 5

Largest rectangle:
height = 5
width = 2  (bars 5 and 6)
area = 5 * 2 = 10
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int largestRectangleArea(vector<int>& heights) {
    stack<int> st;   // increasing height এর indices রাখে
    int maxArea = 0;
    int n = heights.size();

    for (int i = 0; i <= n; i++) {
        int currentHeight = (i == n) ? 0 : heights[i];

        while (!st.empty() && heights[st.top()] > currentHeight) {
            int height = heights[st.top()];
            st.pop();
            int width = st.empty() ? i : (i - st.top() - 1);
            maxArea = max(maxArea, height * width);
        }
        st.push(i);
    }
    return maxArea;
}

int main() {
    vector<int> heights = {2, 1, 5, 6, 2, 3};
    cout << "Histogram heights: ";
    for (int h : heights) cout << h << " ";
    cout << endl;
    cout << "Largest rectangle area: " << largestRectangleArea(heights) << endl;
    return 0;
}
```

```
Histogram heights: 2 1 5 6 2 3
Largest rectangle area: 10
```
(কারণ height `5` এবং `6` এর দুইটা bar মিলিয়ে rectangle area = `2 × 5 = 10`)

**Time Complexity**: `O(n)` **Space Complexity**: `O(n)` (stack এর জন্য)


## 31. How would you design a stack that supports retrieving the minimum/maximum element in O(1)?

**Approach: দুইটা stack ব্যবহার করা** — একটা normal stack (মূল element গুলো রাখে), এবং একটা **auxiliary "min stack"** যেটা প্রতিটি পর্যায়ে **current minimum** track করে।

**MinStack state diagram:**

```text
Operations: push(5), push(3), push(7), push(1)

mainStack:      minStack:
top -> 1        top -> 1
       7               3
       3               3
       5               5

getMin() = minStack.top() = 1

pop():
mainStack pops 1
minStack also pops 1

mainStack:      minStack:
top -> 7        top -> 3
       3               3
       5               5

getMin() = 3
```

```cpp
#include <bits/stdc++.h>
using namespace std;

class MinStack {
    stack<int> mainStack;
    stack<int> minStack;   // প্রতিটি position এ minimum track করে
public:
    void push(int x) {
        mainStack.push(x);
        if (minStack.empty() || x <= minStack.top()) {
            minStack.push(x);
        } else {
            minStack.push(minStack.top());   // পুরনো minimum-ই duplicate করে রাখা
        }
    }
    void pop() {
        mainStack.pop();
        minStack.pop();
    }
    int top() {
        return mainStack.top();
    }
    int getMin() {
        return minStack.top();   // O(1) এ minimum
    }
};

int main() {
    MinStack st;
    st.push(5);
    st.push(3);
    st.push(7);
    st.push(1);

    cout << "Current minimum: " << st.getMin() << endl;   // 1
    st.pop();
    cout << "After pop, minimum: " << st.getMin() << endl;   // 3
    st.pop();
    cout << "After another pop, minimum: " << st.getMin() << endl;   // 3
    return 0;
}
```

```
Current minimum: 1
After pop, minimum: 3
After another pop, minimum: 3
```
**Time Complexity**: প্রতিটি operation `O(1)` **Space Complexity**: `O(n)` (দুইটা stack এর জন্য)


### What additional data structure would you use alongside the stack?

উপরের approach এ একটা **second stack (min stack)** ব্যবহার করা হয়েছে, যেটা মূল stack এর প্রতিটি element এর সাথে **সেই মুহূর্তের minimum value** synchronized ভাবে রাখে। বিকল্প হিসেবে, memory optimize করতে চাইলে min stack এ **শুধু তখনই push করা যায় যখন নতুন minimum পাওয়া যায়** (duplicate না রেখে), কিন্তু তখন pop করার সময় সাবধানে handle করতে হয় (নিচে বর্ণিত)।


### How do you handle duplicates when popping elements?

উপরের implementation এ আমরা প্রতিটি push এ min stack এও একটা value push করছি (হয় নতুন minimum, নাহয় পুরনো minimum এর duplicate) — এতে **push/pop সবসময় synchronized** থাকে, তাই কোনো বিশেষ handling লাগে না।

**Memory-optimized alternative**: min stack-এ নতুন value বর্তমান minimum-এর চেয়ে **ছোট বা সমান** হলে push করতে হবে (`x <= minStack.top()`)। Pop-এর সময় removed value minimum-এর সমান হলে min stack থেকেও pop করতে হবে:

```cpp
void pop() {
    int val = mainStack.top();
    mainStack.pop();
    if (!minStack.empty() && val == minStack.top()) {
        minStack.pop();
    }
}
```
`<=` গুরুত্বপূর্ণ: duplicate minimum-ও আলাদাভাবে push না করলে প্রথম duplicate pop করার সময় minimum state ভুল হয়ে যাবে।


## 32. What is a queue, and what are its core operations?

**Queue** হলো একটা linear data structure যেটা **FIFO (First In, First Out)** principle অনুসরণ করে।

**Core operations:**
- **enqueue(x)**: queue এর পেছনে (rear) নতুন element যোগ করা — `O(1)`
- **dequeue()**: queue এর সামনে (front) থেকে element remove করা — `O(1)`
- **front()**: front element দেখা — `O(1)`
- **isEmpty()**: queue খালি কিনা check করা — `O(1)`

**Queue diagram:**

```text
enqueue(10), enqueue(20), enqueue(30)

front                         rear
  |                            |
  v                            v
+-----+     +-----+     +-----+
| 10  | --> | 20  | --> | 30  |
+-----+     +-----+     +-----+

dequeue() করলে 10 বের হবে।
```

**Operation walkthrough:**

```text
Start:       []
enqueue(10): [10]
enqueue(20): [10, 20]
enqueue(30): [10, 20, 30]
front():     10
dequeue():   [20, 30]
front():     20
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    queue<int> q;
    q.push(1);
    q.push(2);
    q.push(3);

    cout << "Dequeuing order (FIFO): ";
    while (!q.empty()) {
        cout << q.front() << " ";
        q.pop();
    }
    cout << endl;
    return 0;
}
```

```
Dequeuing order (FIFO): 1 2 3
```


### What does FIFO (First In, First Out) mean?

FIFO মানে হলো — যে element সবার আগে যোগ (enqueue) করা হয়েছে, সেটাই সবার আগে বের (dequeue) হবে। এটাকে একটা **লাইনে দাঁড়ানো মানুষ** এর সাথে তুলনা করা যায় — যে আগে লাইনে দাঁড়িয়েছে, সে-ই আগে service পাবে।

```text
Queue line:

front                                      rear
  |                                         |
  v                                         v
Rahim  ->  Karim  ->  Asha  ->  Nila

Service order:
Rahim -> Karim -> Asha -> Nila
```


### What is the difference between a queue, a deque (double-ended queue), and a circular queue?

- **Regular Queue**: শুধু **rear** এ enqueue এবং **front** থেকে dequeue করা যায় — এক-দিকের operation।

- **Deque (Double-Ended Queue)**: **উভয় প্রান্ত** (front এবং rear) থেকেই insert এবং delete করা যায় — অনেক বেশি flexible।

```text
Deque:

push_front(10)      push_back(30)
     |                   |
     v                   v
front [10, 20, 30] rear

pop_front() removes 10
pop_back() removes 30
```

```cpp
deque<int> dq;
dq.push_front(1);   // সামনে insert
dq.push_back(2);    // পেছনে insert
dq.pop_front();      // সামনে থেকে remove
dq.pop_back();       // পেছন থেকে remove
```

- **Circular Queue**: এটা একটা fixed-size array দিয়ে implement করা হয়, কিন্তু যখন rear array এর শেষে পৌঁছায়, তখন এটা আবার **শুরুতে wrap around** করে (যদি সেখানে জায়গা খালি থাকে)। এতে regular array-based queue এর একটা সমস্যা সমাধান হয় — dequeue হওয়ার পর array এর শুরুতে যে জায়গা খালি হয়, সেটা পুনরায় ব্যবহার করা যায় (memory waste হয় না)।

```text
Circular Queue with capacity 5:

Index:  0   1   2   3   4
Value: [ ] [ ] [30][40][50]
             ^       ^
           front    rear

enqueue(60):
rear wraps around to index 0

Index:  0   1   2   3   4
Value: [60][ ] [30][40][50]
        ^       ^
       rear   front
```

## 33. How would you implement a queue using two stacks?

Queue needs FIFO, but stack gives LIFO. দুইটা stack ব্যবহার করলে order দুইবার reverse হয়ে FIFO ফিরে আসে।

```text
enqueue(1), enqueue(2), enqueue(3)

s1:
top -> 3
       2
       1

dequeue() দরকার, s2 empty:
s1 থেকে s2 তে transfer

s2:
top -> 1
       2
       3

এখন s2.top() = 1, অর্থাৎ earliest inserted element.
```

```cpp
#include <bits/stdc++.h>
using namespace std;

class QueueUsingStacks {
    stack<int> s1, s2;   // s1: enqueue এর জন্য, s2: dequeue এর জন্য
public:
    void enqueue(int x) {
        s1.push(x);   // O(1)
    }

    int dequeue() {
        if (s2.empty()) {
            // s1 এর সব element s2 তে transfer করলে order reverse হয়ে যায় (FIFO পাওয়া যায়)
            while (!s1.empty()) {
                s2.push(s1.top());
                s1.pop();
            }
        }
        int front = s2.top();
        s2.pop();
        return front;
    }
};

int main() {
    QueueUsingStacks q;
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);

    cout << "Dequeue order: ";
    cout << q.dequeue() << " ";
    cout << q.dequeue() << " ";
    cout << q.dequeue() << " ";
    cout << endl;
    return 0;
}
```

```
Dequeue order: 1 2 3
```


### What is the time complexity of enqueue and dequeue in your implementation?

- **enqueue**: সবসময় `O(1)` — সরাসরি `s1` তে push করা হয়
- **dequeue**: **Amortized `O(1)`** — কারণ `s2` খালি থাকলেই শুধু `s1` থেকে `s2` তে সব element transfer করতে হয় (`O(n)`), কিন্তু এই transfer প্রতিটি element এর জীবনে **মাত্র একবার** ঘটে (একবার `s1` থেকে `s2` তে গেলে, সেটা directly pop হয়ে যায়)। তাই total `n` টা dequeue operation এ total transfer cost `O(n)`, ফলে প্রতিটি dequeue এর amortized cost = `O(1)`।

Worst case এ একটা single `dequeue` call এ `O(n)` লাগতে পারে (যখন `s2` খালি থাকে এবং `s1` এ অনেক element জমে থাকে), কিন্তু **amortized** ভাবে এটা `O(1)`।


### How would you implement a stack using two queues?

(এটা section 28 এ ইতিমধ্যে বিস্তারিত আলোচনা করা হয়েছে — সংক্ষেপে পুনরাবৃত্তি করছি)

মূল কৌশল: `push` করার সময় নতুন element কে দ্বিতীয় queue তে দিয়ে, তারপর প্রথম queue এর সব পুরনো element তার পেছনে নিয়ে গিয়ে reorder করে দেওয়া হয়, যাতে সবচেয়ে সাম্প্রতিক element সবসময় front এ থাকে। এতে `push` হয় `O(n)`, কিন্তু `pop`/`top` হয় `O(1)`।


## 34. What is a priority queue, and how does it differ from a regular queue?
**Priority Queue** হলো এমন একটা abstract data structure যেখানে প্রতিটি element এর একটা **priority** থাকে, এবং element গুলো তাদের **insertion order অনুযায়ী নয়, বরং priority অনুযায়ী** বের হয় (সবচেয়ে বেশি priority — বা সবচেয়ে কম, min-heap হলে — যুক্ত element সবার আগে বের হয়)।

**মূল পার্থক্য:** Regular queue FIFO অনুসরণ করে, কিন্তু priority queue কোনো নির্দিষ্ট order অনুসরণ করে না — শুধু **সবচেয়ে বেশি (বা কম) priority** যুক্ত element কেই আগে বের করে দেয়, insertion time নির্বিশেষে।

**Regular queue vs priority queue:**

```text
Insert order: 3, 1, 4, 5

Regular queue output:
3 -> 1 -> 4 -> 5

Max priority queue output:
5 -> 4 -> 3 -> 1

Min priority queue output:
1 -> 3 -> 4 -> 5
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    priority_queue<int> maxPQ;   // by default max-heap
    maxPQ.push(3);
    maxPQ.push(1);
    maxPQ.push(4);
    maxPQ.push(1);
    maxPQ.push(5);

    cout << "Max-heap priority queue order: ";
    while (!maxPQ.empty()) {
        cout << maxPQ.top() << " ";
        maxPQ.pop();
    }
    cout << endl;

    priority_queue<int, vector<int>, greater<int>> minPQ;   // min-heap
    minPQ.push(3);
    minPQ.push(1);
    minPQ.push(4);

    cout << "Min-heap priority queue order: ";
    while (!minPQ.empty()) {
        cout << minPQ.top() << " ";
        minPQ.pop();
    }
    cout << endl;
    return 0;
}
```

```
Max-heap priority queue order: 5 4 3 1 1
Min-heap priority queue order: 1 3 4
```


### How is a priority queue typically implemented internally?

Priority queue সবচেয়ে বেশি ব্যবহৃত internal implementation হলো **Binary Heap** (min-heap বা max-heap), যেটা একটা **array-based complete binary tree** হিসেবে represent করা হয়।

**Max-heap diagram:**

```text
Priority queue values: 50, 30, 40, 10, 20

Heap tree:
        50
       /  \
      30   40
     / \
    10 20

Array representation:
Index:  0   1   2   3   4
Value: 50  30  40  10  20

top() = 50
```

- **insert**: `O(log n)` — নতুন element শেষে যোগ করে "heapify up" করা হয়
- **extract-min/max**: `O(log n)` — root remove করে শেষ element কে root এ এনে "heapify down" করা হয়
- **peek (top)**: `O(1)` — root সরাসরি accessible

(বিকল্প implementation: **Fibonacci Heap** — কিছু বিশেষ ক্ষেত্রে (যেমন Dijkstra's algorithm এ decrease-key অপারেশন বেশি হলে) আরো ভালো amortized complexity দেয়, কিন্তু implementation জটিল বলে practical use এ কম দেখা যায়।)


### What are common use cases for priority queues (Dijkstra's algorithm, task scheduling)?

1. **Dijkstra's Algorithm (Shortest Path)**: গ্রাফে প্রতিটি node এর current shortest distance priority হিসেবে ব্যবহার করে, সবচেয়ে কম distance যুক্ত node কে আগে process করার জন্য min-priority queue ব্যবহার করা হয়। এতে `O((V + E) log V)` complexity পাওয়া যায়।

2. **Task Scheduling (OS)**: Operating system এ process scheduling এ, higher priority task গুলো CPU থেকে আগে execution পাওয়ার জন্য priority queue ব্যবহৃত হয়।

3. **Huffman Coding**: Data compression এ character frequency অনুযায়ী priority queue ব্যবহার করে সবচেয়ে কম frequency যুক্ত দুইটা node merge করে optimal encoding tree তৈরি করা হয়।

4. **K largest/smallest elements** বের করা, **median maintaining** (two-heap technique), এবং **event-driven simulation** এ ও priority queue ব্যাপকভাবে ব্যবহৃত হয়।

## 35. What is a monotonic queue/deque, and where is it used?

**Monotonic Deque** হলো একটা deque যেটাতে element গুলো সবসময় **monotonic order** (হয় increasing, নাহয় decreasing) বজায় রাখে। যখন কোনো নতুন element যোগ করা হয়, তখন deque এর পেছন থেকে সব element যেগুলো এই monotonic property ভঙ্গ করে, সেগুলো **remove** করে দেওয়া হয়, তারপর নতুন element যোগ করা হয়।

এটা এমন সব সমস্যায় ব্যবহৃত হয় যেখানে একটা **sliding window** এর মধ্যে maximum/minimum efficiently track করতে হয় — যেমন "Sliding Window Maximum" problem।

**Monotonic decreasing deque idea:**

```text
Window values processed: 1, 3, -1

Read 1:
deque values: [1]

Read 3:
3 is bigger than 1, so 1 can never be maximum while 3 is in window
deque values: [3]

Read -1:
-1 smaller than 3, keep it
deque values: [3, -1]

front always holds current maximum.
```


### How would you solve the "sliding window maximum" problem using a monotonic deque?

**সমস্যা:** একটা array এবং একটা window size `k` দেওয়া আছে। প্রতিটি `k`-size sliding window এর maximum element বের করতে হবে।

**Sliding window walkthrough:**

```text
arr = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

Window [1, 3, -1]     max = 3
Window [3, -1, -3]    max = 3
Window [-1, -3, 5]    max = 5
Window [-3, 5, 3]     max = 5
Window [5, 3, 6]      max = 6
Window [3, 6, 7]      max = 7

Answer = [3, 3, 5, 5, 6, 7]
```

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> maxSlidingWindow(vector<int>& arr, int k) {
    deque<int> dq;   // indices store করা হয়, decreasing order এ (front এ সবচেয়ে বড়)
    vector<int> result;

    for (int i = 0; i < arr.size(); i++) {
        // window এর বাইরে চলে যাওয়া index remove করা
        if (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }

        // current element এর চেয়ে ছোট সব element পেছন থেকে remove করা
        // (কারণ তারা আর কখনো maximum হবে না, current element এর জন্য)
        while (!dq.empty() && arr[dq.back()] < arr[i]) {
            dq.pop_back();
        }

        dq.push_back(i);

        // যখন প্রথম পূর্ণ window তৈরি হয়ে যায়, তখন থেকে result নেওয়া শুরু করা
        if (i >= k - 1) {
            result.push_back(arr[dq.front()]);
        }
    }
    return result;
}

int main() {
    vector<int> arr = {1, 3, -1, -3, 5, 3, 6, 7};
    int k = 3;

    vector<int> result = maxSlidingWindow(arr, k);

    cout << "Array: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    cout << "Sliding window maximums (k=" << k << "): ";
    for (int x : result) cout << x << " ";
    cout << endl;
    return 0;
}
```

```
Array: 1 3 -1 -3 5 3 6 7
Sliding window maximums (k=3): 3 3 5 5 6 7
```

**কীভাবে কাজ করে:**
- Deque এ সবসময় **decreasing order** এ element (index) রাখা হয় — front এ সবসময় current window এর maximum element এর index থাকে
- নতুন element আসলে, deque এর পেছন থেকে তার চেয়ে ছোট সব element remove করে দেওয়া হয় (কারণ সেগুলো আর কখনো maximum হতে পারবে না, যেহেতু নতুন এবং বড় element তাদের চেয়ে পরে window এ থাকবে)
- Window এর বাইরে চলে যাওয়া (outdated) index গুলো front থেকে remove করা হয়


### What is the time complexity of this approach compared to a brute-force solution?

**Brute-force approach**: প্রতিটি window এর জন্য আলাদা করে maximum বের করা — প্রতিটি window এ `O(k)` সময় লাগে, এবং মোট `n - k + 1` টা window আছে, তাই **Total: `O(n × k)`**।

**Monotonic Deque approach**: প্রতিটি element **সর্বোচ্চ একবার push এবং একবার pop** হয় deque এ (amortized analysis, ঠিক monotonic stack এর মতো), তাই **Total: `O(n)`**।

**Summary:**

| Approach | Time Complexity | Space Complexity |
|---|---|---|
| Brute-force | `O(n × k)` | `O(1)` (অথবা `O(n)` result store করতে) |
| Monotonic Deque | `O(n)` | `O(k)` (deque এর জন্য) |

বিশেষত বড় `n` এবং `k` এর জন্য, monotonic deque approach অনেক বেশি efficient — `O(n × k)` থেকে `O(n)` তে নেমে আসা একটা significant improvement।
