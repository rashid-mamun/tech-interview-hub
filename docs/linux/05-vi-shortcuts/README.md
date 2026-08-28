---
title: 'Vi Editor'
---

## 1. How does the Vi editor work?

Vi একটি **modal text editor**—একই key active mode অনুযায়ী ভিন্ন কাজ করে। তাই shortcut শেখার আগে current mode বোঝা সবচেয়ে গুরুত্বপূর্ণ।

### What are the modes in Vi?

- **Normal Mode** (default) – Navigation, copy, delete এবং command execution-এর জন্য।
- **Insert Mode** – Text লেখার জন্য; `i` দিয়ে enter এবং `Esc` দিয়ে exit করা যায়।
- **Command Mode** – Save, quit, search এবং replace-এর জন্য; Normal Mode-এ `:` চাপলে command লেখা যায়।

## 2. How do you navigate in Vi?

- `h` – Cursor **left**-এ নেয়।  
- `l` – Cursor **right**-এ নেয়।  
- `j` – Cursor **down**-এ নেয়।  
- `k` – Cursor **up**-এ নেয়।  
- `0` – Line-এর **শুরুতে** নেয়।  
- `^` – Line-এর **প্রথম non-blank character**-এ নেয়।  
- `$` – Line-এর **শেষে** নেয়।  
- `w` – **Next word**-এ নেয়।  
- `b` – **Previous word**-এ নেয়।  
- `gg` – File-এর **শুরুতে** নেয়।  
- `G` – File-এর **শেষে** নেয়।  
- `:n` – **Line number `n`**-এ নেয়।  

## 3. How do you enter and leave Insert Mode?

- `i` – Cursor-এর আগে insert শুরু করে।  
- `I` – Line-এর শুরুতে insert শুরু করে।  
- `a` – Cursor-এর পরে append শুরু করে।  
- `A` – Line-এর শেষে append শুরু করে।  
- `o` – নিচে নতুন line খুলে।  
- `O` – উপরে নতুন line খুলে।  
- `Esc` – Insert Mode থেকে Normal Mode-এ ফেরে।  

## 4. How do you edit, copy, and paste text?

- `x` – একটি **character** delete করে।  
- `X` – Cursor-এর আগের **character** delete করে।  
- `dw` – একটি **word** delete করে।  
- `dd` – পুরো **line** delete করে।  
- `d$` – Cursor থেকে **line-এর শেষ পর্যন্ত** delete করে।  
- `d0` – Cursor থেকে **line-এর শুরু পর্যন্ত** delete করে।  
- `D` – Cursor থেকে **line-এর শেষ পর্যন্ত** delete করে।  
- `u` – Last action **undo** করে।  
- `Ctrl + r` – Undo করা change **redo** করে।  
- `yy` – একটি **line** copy বা yank করে।  
- `yw` – একটি **word** copy বা yank করে।  
- `p` – Cursor-এর **পরে** paste করে।  
- `P` – Cursor-এর **আগে** paste করে।  

## 5. How do you search and replace text?

- `/pattern` – Pattern **forward** search করে।  
- `?pattern` – Pattern **backward** search করে।  
- `n` – Last search একই direction-এ repeat করে।  
- `N` – Last search বিপরীত direction-এ repeat করে।  
- `:%s/old/new/g` – পুরো file-এ "old"-এর **সব occurrence** "new" দিয়ে replace করে।  
- `:s/old/new/g` – Current line-এর **সব occurrence** replace করে।  

## 6. How do you save, quit, and work with multiple files?

- `:e filename` – একটি **new file** খোলে।  
- `:w` – File save করে।  
- `:wq` – Save করে exit করে।  
- `:q!` – Change save না করে exit করে।  
- `:split filename` – Screen **horizontally** split করে অন্য file খোলে।  
- `:vsplit filename` – Screen **vertically** split করে।  
- `Ctrl + w + w` – Split window-গুলোর মধ্যে switch করে।  

Shortcut প্রত্যাশামতো কাজ না করলে `Esc` চেপে Normal Mode-এ ফিরে command আবার দিন।

:::tip Interview summary
Vi-তে Normal Mode navigation/editing, Insert Mode text entry এবং Command Mode save/search/quit-এর জন্য ব্যবহৃত হয়। Mode বুঝে shortcut ব্যবহার করাই Vi শেখার মূল বিষয়।
:::
