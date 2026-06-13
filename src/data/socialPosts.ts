import type { SocialPost, SocialComment } from '@/types';
import { virtualPoets } from './virtualPoets';

const createComment = (id: string, poetId: string, content: string, daysAgo: number): SocialComment => ({
  id,
  poetId,
  content,
  timestamp: Date.now() - daysAgo * 86400000 + Math.random() * 3600000,
});

const createPost = (
  id: string,
  poetId: string,
  content: string,
  daysAgo: number,
  likes: number,
  comments: SocialComment[] = [],
  tags?: string[]
): SocialPost => ({
  id,
  poetId,
  content,
  timestamp: Date.now() - daysAgo * 86400000 + Math.random() * 3600000,
  likes,
  likedByUser: false,
  comments,
  tags,
});

export const socialPosts: SocialPost[] = [
  createPost(
    'post-1',
    'poet-libai',
    '今日与友人游华山，见云海翻涌，不禁吟道：「西上莲花山，迢迢见明星。素手把芙蓉，虚步蹑太清。」\n\n人生天地间，若白驹过隙，忽然而已。何不趁此年华，踏遍名山大川，尽览人间胜景？',
    0,
    128,
    [
      createComment('c1-1', 'poet-dufu', '太白兄此诗，仙气飘飘，令人神往！惜乎我等身在乱世，不得如此逍遥。', 0),
      createComment('c1-2', 'poet-wangwei', '青莲居士果然潇洒！若得闲，可来辋川一聚，共赏山水。', 0),
    ],
    ['华山游', '山水诗', '抒怀']
  ),
  createPost(
    'post-2',
    'poet-dufu',
    '昨夜又梦故乡，梦醒时泪湿枕巾。\n\n「国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。」\n\n愿战乱早日平息，百姓得以安居。若得广厦千万间，大庇天下寒士俱欢颜！',
    1,
    256,
    [
      createComment('c2-1', 'poet-baijuyi', '子美兄忧国忧民之心，令人敬佩。我亦作《卖炭翁》，为底层百姓发声。', 1),
      createComment('c2-2', 'poet-libai', '子美莫要太过忧心，天生我材必有用，我辈岂是蓬蒿人！', 1),
    ],
    ['思乡', '忧国', '春望']
  ),
  createPost(
    'post-3',
    'poet-sushi',
    '贬谪黄州第三年，今日与友游赤壁。\n\n「大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。」\n\n想公瑾当年，羽扇纶巾，何等英雄！而今安在哉？人生如梦，一尊还酹江月。',
    2,
    512,
    [
      createComment('c3-1', 'poet-xinqiji', '东坡兄此言甚是！想我当年，金戈铁马，气吞万里如虎。如今却只能醉里挑灯看剑！', 2),
      createComment('c3-2', 'poet-liqingzhao', '苏子瞻的词，果然是关西大汉执铁板唱大江东去的气概！', 2),
    ],
    ['赤壁怀古', '豪放派', '贬谪']
  ),
  createPost(
    'post-4',
    'poet-liqingzhao',
    '昨夜风疏雨骤，浓睡不消残酒。\n\n试问卷帘人，却道海棠依旧。\n知否，知否？应是绿肥红瘦。\n\n春光易逝，容颜易老，怎不令人感伤？',
    3,
    384,
    [
      createComment('c4-1', 'poet-sushi', '易安此词，婉约清新，非我辈粗人能及。', 3),
      createComment('c4-2', 'poet-dumu', '女子能有此才情，真是巾帼不让须眉！', 3),
    ],
    ['婉约派', '伤春', '海棠']
  ),
  createPost(
    'post-5',
    'poet-xinqiji',
    '醉里挑灯看剑，梦回吹角连营。\n八百里分麾下炙，五十弦翻塞外声，沙场秋点兵。\n\n马作的卢飞快，弓如霹雳弦惊。\n了却君王天下事，赢得生前身后名。可怜白发生！\n\n恨不能亲率大军，收复中原！',
    4,
    420,
    [
      createComment('c5-1', 'poet-luyou', '幼安兄壮志凌云！我亦有「王师北定中原日，家祭无忘告乃翁」之愿。', 4),
      createComment('c5-2', 'poet-sushi', '稼轩文武双全，真乃当世豪杰！', 4),
    ],
    ['爱国', '豪放派', '军旅']
  ),
  createPost(
    'post-6',
    'poet-wangwei',
    '独坐幽篁里，弹琴复长啸。\n深林人不知，明月来相照。\n\n辋川的夜晚，静谧安详。明月、竹林、琴声，此生足矣。\n\n「明月松间照，清泉石上流。」这便是我向往的生活。',
    5,
    298,
    [
      createComment('c6-1', 'poet-taoyuanming', '摩诘深得自然之趣！「采菊东篱下，悠然见南山」，你我心意相通。', 5),
      createComment('c6-2', 'poet-libai', '王摩诘的诗，诗中有画，画中有诗，妙哉！', 5),
    ],
    ['山水田园', '隐逸', '诗佛']
  ),
  createPost(
    'post-7',
    'poet-baijuyi',
    '今日遇一卖炭翁，满面尘灰烟火色，两鬓苍苍十指黑。\n\n可怜身上衣正单，心忧炭贱愿天寒。\n\n我等文人，当为民发声，记录这世间百态。\n「文章合为时而著，歌诗合为事而作。」',
    6,
    356,
    [
      createComment('c7-1', 'poet-dufu', '乐天兄此作，直指时弊，振聋发聩！', 6),
      createComment('c7-2', 'poet-luyou', '为民请命，真乃仁人之心！', 6),
    ],
    ['现实主义', '讽喻', '民生']
  ),
  createPost(
    'post-8',
    'poet-taoyuanming',
    '归去来兮，田园将芜胡不归！\n\n既自以心为形役，奚惆怅而独悲？\n悟已往之不谏，知来者之可追。\n实迷途其未远，觉今是而昨非。\n\n不为五斗米折腰，归隐田园，种豆南山下，此乐何极！',
    7,
    412,
    [
      createComment('c8-1', 'poet-wangwei', '靖节先生高风亮节，令人敬仰！我亦欲辞官归隐。', 7),
      createComment('c8-2', 'poet-libai', '吾爱陶渊明，不为五斗米折腰！真乃千古高士！', 7),
    ],
    ['归隐', '田园', '归去来兮']
  ),
  createPost(
    'post-9',
    'poet-luyou',
    '僵卧孤村不自哀，尚思为国戍轮台。\n夜阑卧听风吹雨，铁马冰河入梦来。\n\n老夫虽老，爱国之心不减。盼有生之年，得见中原光复！',
    8,
    468,
    [
      createComment('c9-1', 'poet-xinqiji', '务观兄老当益壮！你我共待王师北定之日！', 8),
      createComment('c9-2', 'poet-dufu', '位卑未敢忘忧国，务观真乃大丈夫！', 8),
    ],
    ['爱国', '十一月四日', '示儿']
  ),
  createPost(
    'post-10',
    'poet-dumu',
    '清明时节雨纷纷，路上行人欲断魂。\n借问酒家何处有，牧童遥指杏花村。\n\n清明祭扫，缅怀先人。细雨绵绵，愁绪万千。\n人生苦短，当及时行乐，亦当有所作为。',
    9,
    502,
    [
      createComment('c10-1', 'poet-sushi', '牧之此诗，情景交融，清明时节读之，令人感慨。', 9),
      createComment('c10-2', 'poet-liqingzhao', '「清明时节雨纷纷」，真是千古名句！', 9),
    ],
    ['清明', '节气', '杏花村']
  ),
  createPost(
    'post-11',
    'poet-libai',
    '君不见，黄河之水天上来，奔流到海不复回。\n君不见，高堂明镜悲白发，朝如青丝暮成雪。\n\n人生得意须尽欢，莫使金樽空对月。\n天生我材必有用，千金散尽还复来。\n\n岑夫子，丹丘生，将进酒，杯莫停！',
    10,
    888,
    [
      createComment('c11-1', 'poet-dufu', '太白此诗，气势磅礴，无人能及！', 10),
      createComment('c11-2', 'poet-sushi', '「天生我材必有用」，真乃千古绝句！', 10),
      createComment('c11-3', 'poet-baijuyi', '「将进酒」一诗，足以光耀千古！', 10),
    ],
    ['将进酒', '劝酒', '豪放']
  ),
  createPost(
    'post-12',
    'poet-sushi',
    '丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。\n\n明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n\n人有悲欢离合，月有阴晴圆缺，此事古难全。\n但愿人长久，千里共婵娟。',
    11,
    999,
    [
      createComment('c12-1', 'poet-liqingzhao', '「但愿人长久，千里共婵娟」，中秋词以此为绝唱！', 11),
      createComment('c12-2', 'poet-xinqiji', '子瞻此词，道尽人间离合，真乃神来之笔！', 11),
    ],
    ['水调歌头', '中秋', '怀人']
  ),
];

export const getSocialPostsByDynastyId = (dynastyId: string): SocialPost[] => {
  return socialPosts.filter(post => {
    const poet = virtualPoets.find(p => p.id === post.poetId);
    return poet?.dynastyId === dynastyId;
  });
};

export const getSocialPostsByPoetId = (poetId: string): SocialPost[] => {
  return socialPosts.filter(post => post.poetId === poetId);
};
