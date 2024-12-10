import MainGridItem from './MainGridItem';

export default function MainGrid() {
    const gridItems = [
        { id : 1, category : '영화', title : '인사이드 아웃 후기', content : '안녕하세요~ 개불안이입니다. 이번에 인사이드 아웃2가 개봉해서 보고왔습니다.....', view : 50, comment : 2, like : 12},
        { id : 2, category : '영화', title : '검정고무신 대개봉', content : '추억의 검정고무신이 개봉했습니다. 저도 최근에 보고왔는데요. 기영이 머리가...', view : 50, comment : 2, like : 12},
        { id : 3, category : '영화', title : '브나나 한국오다', content : '세계 최고로 재밌는 브루클린 나인나인의 에이미, 페랄타, 찰스가 한국을 방문한다는 소식인데요.....', view : 50, comment : 2, like : 12},
        { id : 4, category : '영화', title : '인사이드 아웃 후기', content : '안녕하세요~ 개불안이입니다. 이번에 인사이드 아웃2가 개봉해서 보고왔습니다.....', view : 50, comment : 2, like : 12},
        { id : 5, category : '영화', title : '검정고무신 대개봉', content : '추억의 검정고무신이 개봉했습니다. 저도 최근에 보고왔는데요. 기영이 머리가...', view : 50, comment : 2, like : 12},
        { id : 6, category : '영화', title : '브나나 한국오다', content : '세계 최고로 재밌는 브루클린 나인나인의 에이미, 페랄타, 찰스가 한국을 방문한다는 소식인데요.....', view : 50, comment : 2, like : 12},
        { id : 7, category : '영화', title : '인사이드 아웃 후기', content : '안녕하세요~ 개불안이입니다. 이번에 인사이드 아웃2가 개봉해서 보고왔습니다.....', view : 50, comment : 2, like : 12},
        { id : 8, category : '영화', title : '검정고무신 대개봉', content : '추억의 검정고무신이 개봉했습니다. 저도 최근에 보고왔는데요. 기영이 머리가...', view : 50, comment : 2, like : 12},
        { id : 9, category : '영화', title : '브나나 한국오다', content : '세계 최고로 재밌는 브루클린 나인나인의 에이미, 페랄타, 찰스가 한국을 방문한다는 소식인데요.....', view : 50, comment : 2, like : 12},
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {gridItems.map((item) => (
                <MainGridItem
                    key={item.id}
                    title={item.title}
                    content={item.content}
                    view={item.view}
                    comment={item.comment}
                    like={item.like}
                />
            ))}
        </div>
    );
}
