# NEXUS PERSONAL

25〜40歳の社会人を想定した、**架空のパーソナルジム**のランディングページです。副業ポートフォリオ用の制作物で、実在するジムやトレーナーを紹介するものではありません。

[デモを見る](https://engawa-byte.github.io/nexus-personal/)

![PC表示](docs/images/desktop.png)
![スマートフォン表示](docs/images/mobile.png)

## 機能・技術

- 料金シミュレーター：プランと利用月数から税込総額を計算
- FAQ：HTML標準の `details` / `summary` で開閉
- 予約デモフォーム：入力チェックのみ。**外部送信・保存・予約確定は行いません**
- HTML / CSS / Vanilla JavaScript。PC・タブレット・スマートフォンに対応

## ローカル起動・テスト

```bash
python3 -m http.server 8000
```

`http://localhost:8000/` を開いてください。ビルドは不要です。

```bash
node --test test/nexus.test.js
```

## テンプレート・素材

[HTML5 UP「Story」](https://html5up.net/story)（AJ / HTML5 UP、[CC BY 3.0](https://html5up.net/license)）のCSSを基盤に、配色・レイアウト・セクション構成を改修しました。ライセンス全文は [LICENSE.txt](LICENSE.txt) に保持し、ページのフッターにも帰属表示を記載しています。同梱のFont Awesome Freeの[ライセンス](https://fontawesome.com/license/free)も参照してください。

写真は[Pexels License](https://www.pexels.com/license/)に基づき使用しています。写真の人物・施設はNEXUS PERSONALのスタッフ・設備を示しません。

| 画像 | 出典 |
| --- | --- |
| `assets/images/hero-training.jpg` | [Ivan S / Pexels](https://www.pexels.com/photo/man-lifting-dumbbells-4164841/) |
| `assets/images/gym-equipment.jpg` | [Sharath G. / Pexels](https://www.pexels.com/photo/close-up-of-dumbbells-in-a-modern-gym-32543165/) |
| `assets/images/section-dumbbells.jpg` | [Jakub Zerdzicki / Pexels](https://www.pexels.com/photo/close-up-of-dumbbells-in-modern-gym-31015145/) |
