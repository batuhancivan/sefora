import { Link } from 'react-router-dom'
import Info from './Info'

function DemoNote() {
  return (
    <p className="notice">
      Bu metinler, Yeni Medya ve İletişim dersi kapsamında hazırlanan kurgusal SEFORA e-ticaret demosu
      içindir. Gerçek bir ticari işletme, satış veya ödeme söz konusu değildir.
    </p>
  )
}

export function Kvkk() {
  return (
    <Info title="KVKK Aydınlatma Metni">
      <DemoNote />
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, veri sorumlusu sıfatıyla SEFORA
        (kurgusal parfüm evi) tarafından işlenen kişisel verilere ilişkin olarak aşağıdaki aydınlatma metni
        sunulmaktadır. Kozmetik ve parfümeri sektöründe faaliyet gösteren çevrimiçi butiklerde olduğu gibi,
        bu metin; toplanan verilerin neler olduğu, hangi amaçlarla kullanıldığı ve haklarınızı nasıl
        kullanabileceğiniz hakkında sizi bilgilendirmek üzere hazırlanmıştır.
      </p>
      <h3>1. Veri sorumlusu</h3>
      <p>
        SEFORA Demo Butiği · E-posta: kvkk@sefora.demo · Adres: Via della Bellezza, Milano (kurgusal)
      </p>
      <h3>2. İşlenen kişisel veriler</h3>
      <p>
        Üyelik, sipariş, bülten, iletişim formu ve müşteri hizmetleri süreçlerinde; kimlik (ad, soyad), iletişim
        (e-posta, telefon, teslimat adresi), işlem güvenliği, müşteri işlem (sipariş ve sepet kayıtları) ile
        pazarlama verileri işlenebilir. Ödeme ekranı demodur; kart bilgileri saklanmaz.
      </p>
      <h3>3. İşleme amaçları</h3>
      <ul>
        <li>Siparişin alınması, hazırlanması, kargolanması ve faturalandırılması</li>
        <li>Teslimat, iade, cayma ve müşteri ilişkileri süreçlerinin yürütülmesi</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        <li>Bülten ve lansman duyurularının, açık rızanız varsa iletilmesi</li>
        <li>Site deneyiminin iyileştirilmesi ve güvenliğin sağlanması</li>
      </ul>
      <h3>4. Hukuki sebepler</h3>
      <p>
        Veriler; sözleşmenin kurulması ve ifası, hukuki yükümlülük, meşru menfaat ve gerektiğinde açık rızanız
        kapsamında işlenir. Parfüm ve kozmetik ürünlerinde yasal yaş sınırı ve ürün güvenliği süreçleri de bu
        kapsamda değerlendirilebilir.
      </p>
      <h3>5. Aktarım</h3>
      <p>
        Teslimat, ödeme altyapısı, barındırma ve müşteri iletişim hizmeti sağlayan iş ortaklarına, yalnızca
        gerekli olduğu ölçüde aktarım yapılabilir. Demo sitede gerçek aktarım yapılmaz.
      </p>
      <h3>6. Saklama süresi</h3>
      <p>
        Veriler, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca
        saklanır; süre sonunda silinir, yok edilir veya anonim hale getirilir.
      </p>
      <h3>7. Haklarınız</h3>
      <p>
        KVKK’nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme,
        amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü
        kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini
        isteme, otomatik sistemlerle analiz edilmesi nedeniyle aleyhinize bir sonucun ortaya çıkmasına itiraz
        etme ve kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde tazminat talep etme haklarına sahipsiniz.
      </p>
      <p>
        Başvurularınızı kvkk@sefora.demo adresine iletebilirsiniz. Talepler, KVKK ve ilgili tebliğ uyarınca
        en geç otuz gün içinde sonuçlandırılır.
      </p>
      <p>
        Çerezler için <Link to="/cerez-politikasi">Çerez Politikası</Link> sayfamıza bakınız.
      </p>
    </Info>
  )
}

export function Cookies() {
  return (
    <Info title="Çerez Politikası">
      <DemoNote />
      <p>
        SEFORA internet sitesi, ziyaret deneyimini kolaylaştırmak, sepet ve favori tercihlerinizi hatırlamak
        ve site performansını ölçmek amacıyla çerezler ve benzeri teknolojiler kullanabilir. Parfüm e-ticaret
        sitelerinde yaygın olduğu üzere zorunlu, işlevsel ve (onayınız varsa) analitik/pazarlama çerezleri
        söz konusu olabilir.
      </p>
      <h3>Zorunlu çerezler</h3>
      <p>
        Oturum, sepet, güvenlik ve temel site işlevleri için gereklidir. Bu çerezler olmadan sipariş akışı
        sağlıklı çalışmayabilir.
      </p>
      <h3>İşlevsel çerezler</h3>
      <p>Dil, favoriler ve kullanıcı tercihlerinizin hatırlanması için kullanılır.</p>
      <h3>Analitik ve pazarlama çerezleri</h3>
      <p>
        Trafik istatistikleri, kampanya ölçümü ve size daha uygun koleksiyon önerileri sunmak amacıyla
        kullanılabilir. Demo ortamında üçüncü taraf reklam ağı çalışmamaktadır.
      </p>
      <p>
        Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Zorunlu çerezlerin kapatılması
        sitenin bazı bölümlerini kullanılamaz hale getirebilir. Ayrıntılı kişisel veri işleme için{' '}
        <Link to="/kvkk">KVKK Aydınlatma Metni</Link>’ni inceleyiniz.
      </p>
    </Info>
  )
}

export function DistanceSales() {
  return (
    <Info title="Mesafeli Satış Sözleşmesi">
      <DemoNote />
      <p>
        İşbu Mesafeli Satış Sözleşmesi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği hükümleri uyarınca, satıcı ile alıcı arasında elektronik ortamda kurulur. SEFORA
        koleksiyonlarındaki eau de parfum ürünlerinin mesafeli satışı bu çerçevede düzenlenir.
      </p>
      <h3>1. Taraflar</h3>
      <p>
        <strong>Satıcı:</strong> SEFORA Demo Butiği (kurgusal) · kvkk@sefora.demo
        <br />
        <strong>Alıcı:</strong> Sipariş formunda beyan edilen ad, soyad, iletişim ve teslimat bilgileri.
      </p>
      <h3>2. Konu</h3>
      <p>
        Sözleşmenin konusu, alıcının SEFORA internet sitesinden elektronik ortamda sipariş ettiği parfüm
        ürünlerinin satışı ve teslimidir. Ürün nitelikleri, fiyatı, adedi ve teslimat bilgileri sipariş özetinde
        yer alır.
      </p>
      <h3>3. Ürün ve bedel</h3>
      <p>
        Fiyatlar Türk Lirası üzerinden ve sipariş anında sitede ilan edilen tutardır. Kargo, 1.500 TL ve üzeri
        alışverişlerde ücretsiz gösterilir; bu eşik demo amaçlıdır. Demo ödeme alınmaz.
      </p>
      <h3>4. Teslimat</h3>
      <p>
        Ürünler, stok ve lojistik koşullarına bağlı olarak makul sürede, alıcının bildirdiği adrese teslim
        edilir. Teslimat sırasında paketin hasarsız olması esastır. Kozmetik ürünlerinde ambalaj bütünlüğü,
        iade süreçleri açısından önem taşır.
      </p>
      <h3>5. Cayma hakkı</h3>
      <p>
        Alıcı, 14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma
        hakkına sahiptir. Cayma süresi, malın tesliminden itibaren başlar. Hijyen ve sağlık koruması nedeniyle
        ambalajı açılmış, kullanılmış veya mühürü bozulmuş parfümlerde cayma hakkı, mevzuattaki istisnalar
        çerçevesinde kullanılamayabilir.
      </p>
      <h3>6. Uygulanacak hukuk</h3>
      <p>
        Uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. Bu metin bir okul
        projesidir; bağlayıcı ticari sözleşme doğurmaz.
      </p>
    </Info>
  )
}

export function PreInfo() {
  return (
    <Info title="Ön Bilgilendirme Formu">
      <DemoNote />
      <p>
        Mesafeli Sözleşmeler Yönetmeliği uyarınca sipariş öncesinde tüketicinin aşağıdaki hususlarda
        bilgilendirilmesi gerekir. SEFORA, parfümeri e-ticaret pratiklerine uygun olarak bu özeti sipariş
        onayından önce sunar.
      </p>
      <ul>
        <li>Satıcı unvanı, açık adresi ve iletişim bilgileri</li>
        <li>Ürünün temel nitelikleri (eau de parfum, hacim, koku ailesi)</li>
        <li>Vergiler dâhil satış bedeli ve varsa kargo ücreti</li>
        <li>Ödeme yöntemi (demo; gerçek tahsilat yoktur)</li>
        <li>Teslimat süresi ve yöntemi</li>
        <li>Cayma hakkı, istisnaları ve iade koşulları</li>
        <li>Şikâyet ve itirazların iletileceği merciler</li>
      </ul>
      <p>
        Siparişi tamamlamadan önce{' '}
        <Link to="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link> ve{' '}
        <Link to="/tuketici-haklari">Tüketici Hakları</Link> metinlerini okuyunuz.
      </p>
    </Info>
  )
}

export function ConsumerRights() {
  return (
    <Info title="Tüketici Hakları">
      <DemoNote />
      <p>
        SEFORA, 6502 sayılı Tüketicinin Korunması Hakkında Kanun başta olmak üzere tüketici mevzuatına
        uygun hareket etmeyi ilke edinir. Parfüm ve kozmetik ürünlerinin mesafeli satışında tüketicinin;
        doğru bilgilendirme, ayıplı maldan sorumluluk, cayma ve şikâyet hakları saklıdır.
      </p>
      <h3>Ayıplı mal</h3>
      <p>
        Teslim edilen ürünün sitede tanıtılan niteliklere aykırı olması, hasarlı veya eksik teslim edilmesi
        halinde tüketici; ücretsiz onarım, ürünün değiştirilmesi, bedel iadesi veya ayıp oranında indirim
        talep edebilir. Kozmetik ürünlerinde üretim, dolum ve ambalaj hataları bu kapsamda değerlendirilir.
      </p>
      <h3>Cayma hakkı</h3>
      <p>
        Mesafeli satışlarda 14 günlük cayma hakkı bulunur. Sağlık ve hijyen açısından iade uygunluğu olmayan
        ürünler (mühürü açılmış parfümler gibi) yönetmelikteki istisnalara tabi olabilir. Ayrıntı için{' '}
        <Link to="/iade">İade ve Cayma</Link> sayfasına bakınız.
      </p>
      <h3>Şikâyet ve başvuru</h3>
      <p>
        Öncelikle iletisim@sefora.demo üzerinden müşteri hizmetlerine başvurulabilir. Çözülemeyen
        uyuşmazlıklarda tüketicinin yerleşim yerindeki Tüketici Hakem Heyeti veya Tüketici Mahkemesi
        yetkilidir. Ticaret Bakanlığı’nın tüketici şikâyet kanalları da kullanılabilir.
      </p>
      <p>
        Bu sayfa bilgilendirme amaçlıdır; yürürlükteki mevzuat metninin yerini tutmaz.
      </p>
    </Info>
  )
}
