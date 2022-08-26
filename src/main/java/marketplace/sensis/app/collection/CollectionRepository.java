package marketplace.sensis.app.collection;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollectionRepository extends CrudRepository<Collection, Integer> {
	public Collection findByAddress(String address);
	public void deleteByAddress(String address);
}
