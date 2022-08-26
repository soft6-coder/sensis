package marketplace.sensis.app.spotlight;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpotlightRepository extends CrudRepository<Spotlight, Integer> {
	public void deleteByAddress(String address);
}
