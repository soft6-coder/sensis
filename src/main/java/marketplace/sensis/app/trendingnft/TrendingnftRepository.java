package marketplace.sensis.app.trendingnft;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrendingnftRepository extends CrudRepository<Trendingnft, Integer> {
	public void deleteByAddress(String address);

}
